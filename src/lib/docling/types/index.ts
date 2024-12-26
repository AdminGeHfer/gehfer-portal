import { Json } from "@/integrations/supabase/types/json";

export interface ProcessingMetrics {
  [key: string]: Json;
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