export interface ProcessingMetrics {
  processingTime: number;
  chunkCount: number;
  avgCoherence: number;
  tokenCount: number;
}

export interface DocumentChunk {
  content: string;
  embedding: number[];
  metadata: {
    chunkNumber: number;
    coherence: number;
    tokenCount: number;
    processingTime: number;
  };
}