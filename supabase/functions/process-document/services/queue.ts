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

  async executeWithRetry(content: string, chunkSize: number, overlap: number) {
    console.log('Starting document processing...');
    
    const validation = validateContent(content);
    if (!validation.isValid) {
      throw new Error(`Content validation failed: ${validation.error}`);
    }

    const chunks = this.chunkingService.createChunks(content, chunkSize, overlap);
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

    return results;
  }
}