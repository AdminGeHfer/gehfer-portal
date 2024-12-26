import { OpenAIService } from "./OpenAIService";
import { TextProcessor } from "./TextProcessor";
import { ProcessingMetrics, DocumentChunk } from "../types";

export class DoclingProcessor {
  private openAIService: OpenAIService;
  private textProcessor: TextProcessor;
  private initialized: boolean = false;

  constructor() {
    this.openAIService = new OpenAIService();
    this.textProcessor = new TextProcessor();
  }

  async initialize(): Promise<boolean> {
    try {
      await this.openAIService.initialize();
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing DoclingProcessor:', error);
      throw error;
    }
  }

  async processDocument(file: File): Promise<{
    chunks: DocumentChunk[];
    metrics: ProcessingMetrics;
  }> {
    if (!this.initialized) {
      throw new Error("DoclingProcessor not initialized");
    }

    const startTime = performance.now();

    try {
      // Extract text content
      const content = await this.textProcessor.extractText(file);
      
      // Generate semantic chunks
      const rawChunks = await this.textProcessor.generateSemanticChunks(content);
      
      // Process each chunk
      const processedChunks = await Promise.all(
        rawChunks.map(async (chunk, index) => {
          const startTime = performance.now();
          const embedding = await this.openAIService.generateEmbedding(chunk);
          const coherence = await this.textProcessor.calculateCoherence(chunk);
          const tokenCount = await this.textProcessor.countTokens(chunk);

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
        })
      );

      // Calculate metrics
      const metrics = {
        processingTime: performance.now() - startTime,
        chunkCount: processedChunks.length,
        avgCoherence: processedChunks.reduce((sum, chunk) => sum + chunk.metadata.coherence, 0) / processedChunks.length,
        tokenCount: processedChunks.reduce((sum, chunk) => sum + chunk.metadata.tokenCount, 0)
      };

      return {
        chunks: processedChunks,
        metrics
      };
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }
}