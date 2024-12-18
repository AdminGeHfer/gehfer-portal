/* @ai-protected
 * type: "knowledge-base-retriever"
 * status: "optimized"
 * version: "2.0"
 * features: [
 *   "semantic-search",
 *   "reranking",
 *   "dynamic-threshold"
 * ]
 * checksum: "d9c4b3a2e1"
 */

import { supabase } from "@/integrations/supabase/client";
import { Document } from "langchain/document";
import { BaseRetriever } from "@langchain/core/retrievers";
import { RunnableConfig } from "@langchain/core/runnables";

interface EnhancedRetrieverConfig {
  reranking?: boolean;
  semanticAnalysis?: boolean;
  dynamicThreshold?: boolean;
  chunkSize?: number;
  chunkOverlap?: number;
}

export class EnhancedRetriever extends BaseRetriever {
  private config: EnhancedRetrieverConfig;
  
  constructor(config?: EnhancedRetrieverConfig) {
    super();
    this.config = {
      reranking: true,
      semanticAnalysis: true,
      dynamicThreshold: true,
      chunkSize: 1000,
      chunkOverlap: 200,
      ...config
    };
  }

  get lc_namespace(): string[] {
    return ["langchain", "retrievers", "enhanced"];
  }

  async getRelevantDocuments(query: string, runnable_config?: RunnableConfig): Promise<Document[]> {
    try {
      console.log('[EnhancedRetriever] Starting document retrieval for query:', query);
      
      const embedding = await this.generateEmbedding(query);
      console.log('[EnhancedRetriever] Generated embedding');
      
      const initialResults = await this.performSemanticSearchWithRetry(embedding);
      console.log('[EnhancedRetriever] Initial results:', initialResults.length);
      
      const rerankedResults = this.config.reranking 
        ? await this.rerankResults(initialResults, query)
        : initialResults;
      console.log('[EnhancedRetriever] Reranked results:', rerankedResults.length);
      
      const enhancedResults = this.config.semanticAnalysis
        ? await this.enhanceWithSemanticAnalysis(rerankedResults)
        : rerankedResults;
      console.log('[EnhancedRetriever] Enhanced results:', enhancedResults.length);
      
      return this.formatResults(enhancedResults);
    } catch (error) {
      console.error('[EnhancedRetriever] Error in retrieval:', error);
      throw error;
    }
  }

  private async performSemanticSearchWithRetry(embedding: number[], maxRetries: number = 3): Promise<any[]> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[EnhancedRetriever] Attempt ${attempt} of ${maxRetries}`);
        return await this.performSemanticSearch(embedding);
      } catch (error) {
        console.error(`[EnhancedRetriever] Attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    throw new Error('All retry attempts failed');
  }

  private async performSemanticSearch(embedding: number[]) {
    const threshold = this.getThreshold();
    console.log('[EnhancedRetriever] Using threshold:', threshold);
    
    const { data: chunks, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: 10
    });

    if (error) {
      console.error('[EnhancedRetriever] Supabase error:', error);
      throw error;
    }
    return chunks || [];
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    console.log('[EnhancedRetriever] Generating embedding for text');
    const response = await supabase.functions.invoke('generate-embedding', {
      body: { text }
    });

    if (response.error) {
      console.error('[EnhancedRetriever] Embedding generation error:', response.error);
      throw response.error;
    }
    return response.data.embedding;
  }

  private async rerankResults(results: any[], query: string) {
    console.log('[EnhancedRetriever] Reranking results');
    if (!results.length) return results;
    
    const reranked = results.map(result => ({
      ...result,
      score: this.calculateRelevanceScore(result, query)
    }));

    return reranked.sort((a, b) => b.score - a.score);
  }

  private calculateRelevanceScore(result: any, query: string): number {
    const terms = query.toLowerCase().split(' ');
    const content = result.content.toLowerCase();
    
    return terms.reduce((score, term) => {
      const frequency = (content.match(new RegExp(term, 'g')) || []).length;
      return score + (frequency > 0 ? (1 + Math.log(frequency)) : 0);
    }, 0);
  }

  private async enhanceWithSemanticAnalysis(results: any[]) {
    console.log('[EnhancedRetriever] Enhancing results with semantic analysis');
    return results.map(result => ({
      ...result,
      semantic_context: this.extractSemanticContext(result.content)
    }));
  }

  private extractSemanticContext(content: string): string {
    const sentences = content.split(/[.!?]+/).filter(Boolean);
    return sentences.length > 2 ? sentences.slice(0, 2).join('. ') + '.' : content;
  }

  private getThreshold(): number {
    return this.config.dynamicThreshold ? this.calculateDynamicThreshold() : 0.7;
  }

  private calculateDynamicThreshold(): number {
    // Implementar lógica dinâmica baseada em métricas
    return 0.6;
  }

  private formatResults(results: any[]): Document[] {
    console.log('[EnhancedRetriever] Formatting final results');
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