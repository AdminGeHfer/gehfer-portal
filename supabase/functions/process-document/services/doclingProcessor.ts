import { ProcessingMetrics } from "../utils/metrics.ts";
import { ChunkingService } from "./chunking.ts";
import { EmbeddingsService } from "./embeddings.ts";

export class DoclingProcessor {
  private metrics: ProcessingMetrics;
  private chunkingService: ChunkingService;
  private embeddingsService: EmbeddingsService;

  constructor(metrics: ProcessingMetrics) {
    this.metrics = metrics;
    this.chunkingService = new ChunkingService();
    this.embeddingsService = new EmbeddingsService(metrics);
  }

  async processDocument(documentId: string, filePath: string, supabase: any) {
    console.log('Starting Docling processing for document:', documentId);
    
    try {
      // Fetch document content
      const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/documents/${filePath}`);
      const content = await response.text();
      
      // Create semantic chunks
      const chunks = this.chunkingService.createChunks(content);
      console.log(`Created ${chunks.length} semantic chunks`);
      
      // Process each chunk
      const processedChunks = [];
      for (const chunk of chunks) {
        // Generate embedding
        const embedding = await this.embeddingsService.generateEmbedding(chunk.content);
        
        // Calculate coherence score
        const coherenceScore = await this.calculateChunkCoherence(chunk.content);
        
        // Save chunk
        const { data: chunkData, error: chunkError } = await supabase
          .from('document_chunks')
          .insert({
            document_id: documentId,
            content: chunk.content,
            embedding,
            metadata: {
              ...chunk.metadata,
              coherence_score: coherenceScore,
              processor: 'docling',
              version: '1.0'
            }
          })
          .select()
          .single();

        if (chunkError) throw chunkError;
        processedChunks.push(chunkData);
      }

      // Calculate document-level metrics
      const avgCoherence = processedChunks.reduce((acc, chunk) => 
        acc + chunk.metadata.coherence_score, 0) / processedChunks.length;

      // Update document status
      const { error: updateError } = await supabase
        .from('documents')
        .update({ 
          processed: true,
          metadata: {
            processor: 'docling',
            version: '1.0',
            chunks_count: processedChunks.length,
            avg_coherence: avgCoherence,
            processed_at: new Date().toISOString()
          }
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      return {
        success: true,
        chunks: processedChunks,
        metrics: {
          chunksCount: processedChunks.length,
          avgCoherence,
          processingTime: this.metrics.getExecutionTime()
        }
      };
    } catch (error) {
      console.error('Error in Docling processing:', error);
      throw error;
    }
  }

  private async calculateChunkCoherence(content: string): Promise<number> {
    // Simplified coherence calculation for now
    // This should be enhanced with proper semantic analysis
    const wordCount = content.split(/\s+/).length;
    const sentenceCount = content.split(/[.!?]+/).length;
    
    // Basic coherence score based on average words per sentence
    // Optimal range is considered 15-20 words per sentence
    const avgWordsPerSentence = wordCount / sentenceCount;
    const coherenceScore = Math.min(1, Math.max(0, 
      1 - Math.abs(avgWordsPerSentence - 17.5) / 17.5
    ));
    
    return coherenceScore;
  }
}