import { supabase } from "@/integrations/supabase/client";
import { Document } from "langchain/document";
import { BaseRetriever } from "@langchain/core/retrievers";
import { aiLogger, AILogStage } from "@/lib/logging/aiLoggingService";

interface SearchResult {
  id: string;
  content: string;
  metadata;
  similarity: number;
}

interface EnhancedRetrieverConfig {
  searchThreshold?: number;
  maxResults?: number;
  chunkSize?: number;
  chunkOverlap?: number;
  dynamicThreshold?: boolean;
  reranking?: boolean;
  semanticAnalysis?: boolean;
}

export class EnhancedRetriever extends BaseRetriever {
  private searchThreshold: number;
  private maxResults: number;
  private config: EnhancedRetrieverConfig;
  
  lc_namespace = ["custom", "retriever"];

  constructor(config: EnhancedRetrieverConfig = {}) {
    super();
    this.searchThreshold = config.searchThreshold || 0.4;
    this.maxResults = config.maxResults || 5;
    this.config = config;
  }

  async getRelevantDocuments(
    query: string,
  ): Promise<Document[]> {
    const startTime = Date.now();
    
    try {
      console.log('EnhancedRetriever: Generating embedding for query:', query);
      
      await aiLogger.logEvent({
        stage: AILogStage.QUERY_PROCESSING,
        details: {
          query,
          threshold: this.searchThreshold,
          maxResults: this.maxResults,
          config: this.config
        }
      });

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
        throw new Error(`OpenAI API error: ${embeddingResponse.statusText}`);
      }

      const { data } = await embeddingResponse.json();
      const embedding = data[0].embedding;

      await aiLogger.logEvent({
        stage: AILogStage.EMBEDDING_GENERATION,
        details: {
          success: true,
          dimensions: embedding.length,
          model: 'text-embedding-3-small'
        }
      });

      console.log('EnhancedRetriever: Embedding generated successfully');
      console.log('EnhancedRetriever: Searching documents with threshold:', this.searchThreshold);

      const { data: documents, error } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: this.searchThreshold,
        match_count: this.maxResults
      });

      if (error) {
        console.error('EnhancedRetriever: Error searching documents:', error);
        throw error;
      }

      const searchTime = Date.now() - startTime;
      
      await aiLogger.logEvent({
        stage: AILogStage.DOCUMENT_MATCHING,
        details: {
          documentsFound: documents?.length || 0,
          searchTimeMs: searchTime,
          topMatches: documents?.slice(0, 3).map(d => ({
            id: d.id,
            similarity: d.similarity,
            snippet: d.content.substring(0, 100)
          }))
        }
      });

      console.log('EnhancedRetriever: Found documents:', documents?.length || 0);
      
      if (documents && documents.length > 0) {
        console.log('EnhancedRetriever: Similarity scores:', 
          documents.map(d => ({ id: d.id, similarity: d.similarity }))
        );
      }

      return (documents || []).map((doc: SearchResult) => {
        return new Document({
          pageContent: doc.content,
          metadata: {
            ...doc.metadata,
            id: doc.id,
            similarity: doc.similarity
          }
        });
      });
    } catch (error) {
      console.error('EnhancedRetriever: Error in getRelevantDocuments:', error);
      
      await aiLogger.logEvent({
        stage: AILogStage.DOCUMENT_MATCHING,
        details: {
          error: error.message,
          searchTimeMs: Date.now() - startTime,
          success: false
        }
      });
      
      throw error;
    }
  }
}