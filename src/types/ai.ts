export interface Message {
  id: string;
  conversation_id: string;
  role: 'system' | 'assistant' | 'user';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

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

export interface MemoryOption {
  id: string;
  name: string;
  description: string;
}

export interface ChainTypeOption {
  id: string;
  name: string;
  description: string;
}

export interface EmbeddingModel {
  id: string;
  name: string;
  description: string;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
}
