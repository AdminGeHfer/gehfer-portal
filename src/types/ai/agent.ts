import { Database } from "@/integrations/supabase/types";

export type MemoryType = 'buffer' | 'window' | 'summary';
export type ChainType = 'conversation' | 'qa' | 'conversational_qa';
export type SearchType = 'similarity' | 'mmr';
export type OutputFormat = 'text' | 'structured' | 'markdown';

export interface AIAgent {
  id: string;
  name: string;
  description?: string;
  model_id: string;
  memory_type: MemoryType;
  use_knowledge_base: boolean;
  temperature: number;
  max_tokens: number;
  top_p: number;
  top_k: number;
  stop_sequences: string[];
  chain_type: ChainType;
  chunk_size: number;
  chunk_overlap: number;
  embedding_model: string;
  search_type: SearchType;
  search_threshold: number;
  output_format: OutputFormat;
  tools: string[];
  system_prompt?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface AIAgentConfig {
  name: string;
  description: string;
  modelId: string;
  memoryType: MemoryType;
  useKnowledgeBase: boolean;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  stopSequences: string[];
  chainType: ChainType;
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
  searchType: SearchType;
  searchThreshold: number;
  outputFormat: OutputFormat;
  tools: string[];
  systemPrompt: string;
}