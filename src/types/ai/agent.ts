export interface AIAgent {
  id: string;
  name: string;
  description?: string;
  model_id: string;
  memory_type: 'buffer' | 'summary' | 'hierarchical';
  use_knowledge_base: boolean;
  temperature: number;
  max_tokens: number;
  top_p: number;
  top_k: number;
  stop_sequences?: string[];
  chain_type: 'conversation' | 'qa' | 'agent';
  chunk_size: number;
  chunk_overlap: number;
  embedding_model: string;
  search_type: 'similarity' | 'mmr';
  search_threshold: number;
  output_format: 'text' | 'json' | 'markdown';
  tools?: string[];
  system_prompt?: string;
  user_id: string;
  agent_type?: string;
  external_url?: string;
  auth_token?: string;
  icon?: string;
  color?: string;
  template_id?: string;
}

export interface AIAgentConfig {
  name: string;
  description?: string;
  modelId: string;
  memoryType: 'buffer' | 'summary' | 'hierarchical';
  useKnowledgeBase: boolean;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
  stopSequences?: string[];
  chainType: 'conversation' | 'qa' | 'agent';
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
  searchType: 'similarity' | 'mmr';
  searchThreshold: number;
  outputFormat: 'text' | 'json' | 'markdown';
  tools?: string[];
  systemPrompt?: string;
}

export const configToAgent = (config: AIAgentConfig, userId: string): Partial<AIAgent> => ({
  name: config.name,
  description: config.description,
  model_id: config.modelId,
  memory_type: config.memoryType,
  use_knowledge_base: config.useKnowledgeBase,
  temperature: config.temperature,
  max_tokens: config.maxTokens,
  top_p: config.topP,
  top_k: config.topK,
  stop_sequences: config.stopSequences,
  chain_type: config.chainType,
  chunk_size: config.chunkSize,
  chunk_overlap: config.chunkOverlap,
  embedding_model: config.embeddingModel,
  search_type: config.searchType,
  search_threshold: config.searchThreshold,
  output_format: config.outputFormat,
  tools: config.tools,
  system_prompt: config.systemPrompt,
  user_id: userId
});