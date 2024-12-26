import { supabase } from '@/integrations/supabase/client';
import { ProcessingMetrics, DocumentChunk } from '../types';
import OpenAI from 'openai';

export class DoclingProcessor {
  private openai: OpenAI;
  private metrics: ProcessingMetrics;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.metrics = {
      processingTime: 0,
      chunkCount: 0,
      avgCoherence: 0,
      tokenCount: 0
    };
  }

  async processDocument(file: File): Promise<{
    chunks: DocumentChunk[];
    metrics: ProcessingMetrics;
  }> {
    console.log('Starting document processing:', file.name);
    const startTime = performance.now();

    try {
      // Extract text content
      const content = await this.extractText(file);
      
      // Generate semantic chunks
      const chunks = await this.generateSemanticChunks(content);
      
      // Process each chunk
      const processedChunks = await Promise.all(
        chunks.map((chunk, index) => this.processChunk(chunk, index))
      );

      // Calculate metrics
      const metrics = {
        processingTime: performance.now() - startTime,
        chunkCount: chunks.length,
        avgCoherence: this.calculateAverageCoherence(processedChunks),
        tokenCount: await this.countTokens(content)
      };

      // Save metrics
      await this.saveMetrics(file.name, metrics, processedChunks);

      return {
        chunks: processedChunks,
        metrics
      };
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }

  private async extractText(file: File): Promise<string> {
    // Implementation depends on file type
    const text = await file.text();
    return text;
  }

  private async generateSemanticChunks(content: string): Promise<string[]> {
    const chunks: string[] = [];
    const sentences = content.split(/[.!?]+/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > 1000) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  private async processChunk(chunk: string, index: number): Promise<DocumentChunk> {
    const startTime = performance.now();

    // Generate embedding
    const embedding = await this.generateEmbedding(chunk);

    // Calculate coherence
    const coherence = await this.calculateCoherence(chunk);

    // Count tokens
    const tokenCount = await this.countTokens(chunk);

    return {
      content: chunk,
      embedding,
      metadata: {
        chunkNumber: index + 1,
        coherence,
        tokenCount,
        processingTime: performance.now() - startTime
      }
    };
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      input: text,
      model: 'text-embedding-3-small'
    });

    return response.data[0].embedding;
  }

  private async calculateCoherence(text: string): Promise<number> {
    // Simplified coherence calculation
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    if (sentences.length <= 1) return 1.0;

    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    const deviation = sentences.reduce((sum, s) => sum + Math.abs(s.length - avgLength), 0) / sentences.length;
    
    return Math.max(0, Math.min(1, 1 - (deviation / avgLength)));
  }

  private calculateAverageCoherence(chunks: DocumentChunk[]): number {
    if (chunks.length === 0) return 0;
    return chunks.reduce((sum, chunk) => sum + chunk.metadata.coherence, 0) / chunks.length;
  }

  private async countTokens(text: string): Promise<number> {
    // Simplified token counting
    return text.split(/\s+/).length;
  }

  private async saveMetrics(filename: string, metrics: ProcessingMetrics, chunks: DocumentChunk[]) {
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        metadata: { 
          filename,
          contentType: 'text/plain',
          processor: 'docling',
          version: '2.0',
          metrics: JSON.stringify(metrics)
        },
        processed: true
      })
      .select()
      .single();

    if (docError) throw docError;

    // Save chunks
    const chunkRecords = chunks.map((chunk, index) => ({
      document_id: document.id,
      content: chunk.content,
      embedding: JSON.stringify(chunk.embedding),
      metadata: chunk.metadata,
      chunk_number: index + 1,
      token_count: chunk.metadata.tokenCount,
      processing_time: chunk.metadata.processingTime,
      coherence_score: chunk.metadata.coherence
    }));

    const { error: chunksError } = await supabase
      .from('document_chunks')
      .insert(chunkRecords);

    if (chunksError) throw chunksError;
  }
}