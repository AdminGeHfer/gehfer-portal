import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedKnowledgeBaseConfig {
  searchThreshold: number;
  maxResults: number;
  reranking: boolean;
  semanticAnalysis: boolean;
}

export class EnhancedKnowledgeBase {
  private vectorStore: SupabaseVectorStore;
  private embeddings: OpenAIEmbeddings;
  private config: EnhancedKnowledgeBaseConfig;

  constructor(config: EnhancedKnowledgeBaseConfig) {
    this.config = config;
    this.embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small"
    });

    this.vectorStore = new SupabaseVectorStore(this.embeddings, {
      client: supabase,
      tableName: 'documents',
      queryName: 'match_documents'
    });
  }

  async getRelevantDocuments(query: string): Promise<Document[]> {
    console.log('Getting relevant documents with config:', this.config);

    try {
      const results = await this.vectorStore.similaritySearch(query, this.config.maxResults);

      if (this.config.reranking) {
        results.sort((a, b) => {
          const scoreA = this.calculateRelevanceScore(a, query);
          const scoreB = this.calculateRelevanceScore(b, query);
          return scoreB - scoreA;
        });
      }

      console.log(`Found ${results.length} relevant documents`);
      return results;

    } catch (error) {
      console.error('Error getting relevant documents:', error);
      throw error;
    }
  }

  private calculateRelevanceScore(doc: Document, query: string): number {
    // Implementação básica de scoring, pode ser melhorada com mais métricas
    const contentLength = doc.pageContent.length;
    const queryTerms = query.toLowerCase().split(' ');
    const contentTerms = doc.pageContent.toLowerCase().split(' ');
    
    let termMatches = 0;
    queryTerms.forEach(term => {
      if (contentTerms.includes(term)) termMatches++;
    });

    return (termMatches / queryTerms.length) * (1 - Math.log(contentLength) / 10);
  }
}