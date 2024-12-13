import { ProcessingMetrics } from "../utils/metrics.ts";
import { validateContent } from "../utils/validation.ts";
import { ChunkingService } from "./chunking.ts";
import { EmbeddingsService } from "./embeddings.ts";

export class QueueService {
  private chunkingService: ChunkingService;
  private embeddingsService: EmbeddingsService;
  private metrics: ProcessingMetrics;

  constructor(metrics: ProcessingMetrics) {
    this.metrics = metrics;
    this.chunkingService = new ChunkingService();
    this.embeddingsService = new EmbeddingsService(metrics);
  }

  async executeWithRetry(documentId: string, filePath: string) {
    console.log('Starting document processing...', { documentId, filePath });
    
    // Fetch document content
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/documents/${filePath}`);
    const content = await response.text();
    
    const validation = validateContent(content);
    if (!validation.isValid) {
      throw new Error(`Content validation failed: ${validation.error}`);
    }

    const chunks = this.chunkingService.createChunks(content, 1000, 200);
    console.log(`Created ${chunks.length} chunks`);
    this.metrics.trackMetric('chunks_created', chunks.length);

    const results = [];
    for (let i = 0; i < chunks.length; i++) {
      try {
        console.log(`Processing chunk ${i + 1}/${chunks.length}`);
        const embedding = await this.embeddingsService.generateEmbedding(chunks[i]);
        results.push({
          content: chunks[i],
          embedding,
        });
        this.metrics.trackMetric('chunks_processed', i + 1);
      } catch (error) {
        console.error(`Error processing chunk ${i}:`, error);
        throw error;
      }
    }

    // Return combined results
    return {
      content: content,
      embedding: results[0]?.embedding, // Use first chunk's embedding for document
      chunks: results
    };
  }
}