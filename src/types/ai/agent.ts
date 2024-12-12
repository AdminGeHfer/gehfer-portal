import { Database } from "@/integrations/supabase/types";

export type AIAgent = Database["public"]["Tables"]["ai_agents"]["Row"];
export type AIAgentInsert = Database["public"]["Tables"]["ai_agents"]["Insert"];
export type AIAgentUpdate = Database["public"]["Tables"]["ai_agents"]["Update"];

export interface AIAgentConfig {
  name: string;
  description: string;
  modelId: string;
  memoryType: 'buffer' | 'window' | 'summary';
  useKnowledgeBase: boolean;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  stopSequences: string[];
  chainType: 'conversation' | 'qa' | 'conversational_qa';
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
  searchType: 'similarity' | 'mmr';
  searchThreshold: number;
  outputFormat: 'text' | 'structured' | 'markdown';
  tools: string[];
  systemPrompt: string;
}