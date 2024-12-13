import { ProcessingMetrics } from "../utils/metrics.ts";
import { validateContent } from "../utils/validation.ts";
import { ChunkingService } from "./chunking.ts";
import { EmbeddingsService } from "./embeddings.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

export class QueueService {
  private chunkingService: ChunkingService;
  private embeddingsService: EmbeddingsService;
  private metrics: ProcessingMetrics;
  private supabase: any;

  constructor(metrics: ProcessingMetrics) {
    this.metrics = metrics;
    this.chunkingService = new ChunkingService();
    this.embeddingsService = new EmbeddingsService(metrics);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async executeWithRetry(documentId: string, filePath: string) {
    console.log('Starting document processing...', { documentId, filePath });
    
    try {
      // Fetch document content
      const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/documents/${filePath}`);
      const content = await response.text();
      
      const validation = validateContent(content);
      if (!validation.isValid) {
        throw new Error(`Content validation failed: ${validation.error}`);
      }

      // Create chunks
      const chunks = this.chunkingService.createChunks(content);
      console.log(`Created ${chunks.length} chunks`);
      this.metrics.trackMetric('chunks_created', chunks.length);

      // Process each chunk
      const processedChunks = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`Processing chunk ${i + 1}/${chunks.length}`);
        
        try {
          const embedding = await this.embeddingsService.generateEmbedding(chunk.content);
          
          // Save chunk
          const { data: chunkData, error: chunkError } = await this.supabase
            .from('document_chunks')
            .insert({
              document_id: documentId,
              content: chunk.content,
              embedding,
              metadata: {
                ...chunk.metadata,
                filename: filePath.split('/').pop()
              }
            })
            .select()
            .single();

          if (chunkError) throw chunkError;
          
          processedChunks.push({
            content: chunk.content,
            embedding
          });
          
          this.metrics.trackMetric('chunks_processed', i + 1);
        } catch (error) {
          console.error(`Error processing chunk ${i}:`, error);
          throw error;
        }
      }

      // Update document status
      const { error: updateError } = await this.supabase
        .from('documents')
        .update({ 
          processed: true,
          content: content,
          embedding: processedChunks[0]?.embedding // Use first chunk embedding as document embedding
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      console.log(`Document ${documentId} processed successfully`);
      return {
        success: true,
        chunks: processedChunks,
        content: content
      };
    } catch (error) {
      console.error('Error in document processing:', error);
      throw error;
    }
  }
}