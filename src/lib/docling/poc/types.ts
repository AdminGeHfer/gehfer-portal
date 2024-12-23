export interface ProcessingMetrics {
  file: string;
  processingTime: number;
  cpuUsage: number;
  ramUsage: number;
  numChunks: number;
  docSize: number;
}

export interface DocumentChunk {
  content: string;
  metadata: {
    position: number;
    length: number;
  };
  embedding?: number[];
}

export interface DocumentConverter {
  convert: (file: File) => Promise<{
    document: {
      export_to_markdown: () => string;
    };
  }>;
}

export interface DocumentChunker {
  chunk: (doc: { export_to_markdown: () => string }) => DocumentChunk[];
}