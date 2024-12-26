import { BaseRetriever } from "@langchain/core/retrievers";
import { Document } from "@langchain/core/documents";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { supabase } from "@/integrations/supabase/client";

interface KnowledgeBaseConfig {
  searchThreshold?: number;
  maxResults?: number;
  reranking?: boolean;
  semanticAnalysis?: boolean;
}

interface DocumentMetadata {
  [key: string]: any;
}

export class EnhancedKnowledgeBase extends BaseRetriever {
  private model: ChatOpenAI;
  private searchThreshold: number;
  private maxResults: number;
  private config: KnowledgeBaseConfig;
  
  lc_namespace = ["custom", "enhanced_knowledge_base"];

  constructor(config: KnowledgeBaseConfig = {}) {
    super();
    this.searchThreshold = config.searchThreshold || 0.7;
    this.maxResults = config.maxResults || 5;
    this.config = config;
    this.model = new ChatOpenAI({
      modelName: "gpt-4-turbo-preview",
      temperature: 0.7,
    });
  }

  async _getRelevantDocuments(query: string): Promise<Document[]> {
    console.log('Searching knowledge base for:', query);

    try {
      // Generate embedding for query
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: query,
          model: 'text-embedding-3-small'
        })
      });

      if (!embeddingResponse.ok) {
        throw new Error('Failed to generate embedding');
      }

      const { data } = await embeddingResponse.json();
      const embedding = data[0].embedding;

      // Search for relevant documents
      const { data: documents, error } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: this.searchThreshold,
        match_count: this.maxResults
      });

      if (error) throw error;

      if (!documents?.length) {
        console.log('No relevant documents found');
        return [];
      }

      console.log(`Found ${documents.length} relevant documents`);

      // Transform to LangChain Document format with type-safe metadata handling
      const transformedDocs = documents.map(doc => {
        const baseMetadata: DocumentMetadata = {
          score: doc.similarity
        };
        
        // Safely merge the document metadata if it exists
        const documentMetadata = (doc.metadata || {}) as DocumentMetadata;
        const mergedMetadata = { ...baseMetadata, ...documentMetadata };

        return new Document({
          pageContent: doc.content,
          metadata: mergedMetadata
        });
      });

      if (this.config.reranking) {
        return await this.rerank(transformedDocs, query);
      }

      return transformedDocs;

    } catch (error) {
      console.error('Error in knowledge base search:', error);
      throw error;
    }
  }

  async rerank(documents: Document[], query: string): Promise<Document[]> {
    if (!this.config.reranking || documents.length <= 1) {
      return documents;
    }

    const rerankPrompt = PromptTemplate.fromTemplate(`
      Given the query: {query}
      
      Rate how relevant this document is on a scale of 0-10:
      {document}
      
      Rating (0-10):
    `);

    const chain = RunnableSequence.from([
      rerankPrompt,
      this.model,
      new StringOutputParser()
    ]);

    const scores = await Promise.all(
      documents.map(async (doc) => {
        const score = await chain.invoke({
          query,
          document: doc.pageContent
        });
        return { doc, score: parseFloat(score) || 0 };
      })
    );

    return scores
      .sort((a, b) => b.score - a.score)
      .map(item => item.doc);
  }
}