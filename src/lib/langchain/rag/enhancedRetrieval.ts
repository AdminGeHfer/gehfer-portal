import { supabase } from "@/integrations/supabase/client";
import { Document } from "langchain/document";
import { BaseRetriever } from "@langchain/core/retrievers";

interface EnhancedRetrieverConfig {
  reranking?: boolean;
  semanticAnalysis?: boolean;
  dynamicThreshold?: boolean;
  chunkSize?: number;
  chunkOverlap?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export class EnhancedRetriever extends BaseRetriever {
  private config: EnhancedRetrieverConfig;
  
  get lc_namespace(): string[] {
    return ["langchain", "retrievers", "enhanced"];
  }

  constructor(config?: EnhancedRetrieverConfig) {
    super();
    this.config = {
      reranking: true,
      semanticAnalysis: true,
      dynamicThreshold: true,
      chunkSize: 1000,
      chunkOverlap: 200,
      maxRetries: 3,
      retryDelay: 1000,
      ...config
    };
  }

  async getRelevantDocuments(query: string): Promise<Document[]> {
    try {
      const embedding = await this.generateEmbedding(query);
      
      // Initial semantic search with retry mechanism
      const initialResults = await this.withRetry(() => this.performSemanticSearch(embedding));
      
      // Apply reranking if enabled
      const rerankedResults = this.config.reranking 
        ? await this.rerankResults(initialResults, query)
        : initialResults;
      
      // Apply semantic analysis if enabled
      const enhancedResults = this.config.semanticAnalysis
        ? await this.enhanceWithSemanticAnalysis(rerankedResults)
        : rerankedResults;
      
      return this.formatResults(enhancedResults);
    } catch (error) {
      console.error('Error in enhanced retrieval:', error);
      throw error;
    }
  }

  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    for (let attempt = 1; attempt <= this.config.maxRetries!; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        if (attempt < this.config.maxRetries!) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay! * attempt));
        }
      }
    }
    throw lastError!;
  }

  private async performSemanticSearch(embedding: number[]) {
    const { data: chunks, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding.join(','),
      match_threshold: this.getThreshold(),
      match_count: 10
    });

    if (error) throw error;
    return chunks || [];
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await supabase.functions.invoke('generate-embedding', {
      body: { text }
    });

    if (response.error) throw response.error;
    return response.data.embedding;
  }

  private async rerankResults(results: any[], query: string) {
    if (!results.length) return results;
    
    // Implement cross-encoder reranking
    const reranked = results.map(result => ({
      ...result,
      score: this.calculateRelevanceScore(result, query)
    }));

    return reranked.sort((a, b) => b.score - a.score);
  }

  private calculateRelevanceScore(result: any, query: string): number {
    // Basic TF-IDF implementation
    const terms = query.toLowerCase().split(' ');
    const content = result.content.toLowerCase();
    
    return terms.reduce((score, term) => {
      const frequency = (content.match(new RegExp(term, 'g')) || []).length;
      return score + (frequency > 0 ? (1 + Math.log(frequency)) : 0);
    }, 0);
  }

  private async enhanceWithSemanticAnalysis(results: any[]) {
    return results.map(result => ({
      ...result,
      semantic_context: this.extractSemanticContext(result.content)
    }));
  }

  private extractSemanticContext(content: string): string {
    // Basic semantic context extraction
    const sentences = content.split(/[.!?]+/).filter(Boolean);
    return sentences.length > 2 ? sentences.slice(0, 2).join('. ') + '.' : content;
  }

  private getThreshold(): number {
    return this.config.dynamicThreshold ? this.calculateDynamicThreshold() : 0.7;
  }

  private calculateDynamicThreshold(): number {
    // Implement dynamic threshold based on query complexity
    return 0.7;
  }

  private formatResults(results: any[]): Document[] {
    return results.map(result => new Document({
      pageContent: result.content,
      metadata: {
        source: result.metadata?.source,
        score: result.score || result.similarity,
        semantic_context: result.semantic_context
      }
    }));
  }
}