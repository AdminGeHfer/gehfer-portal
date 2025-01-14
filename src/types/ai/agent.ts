import { AgentType } from "./agent-types";

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
  agent_type: AgentType;
  external_url?: string;
  auth_token?: string;
  icon?: string;
  color?: string;
  template_id?: string;
  connection_status?: string;
  last_tested?: string;
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

// Helper function to convert from config (camelCase) to database format (snake_case)
export const configToAgent = (config: AIAgentConfig, userId: string): Partial<AIAgent> => {
  return {
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
    user_id: userId,
  };
};

// Helper function to convert from database format (snake_case) to config (camelCase)
export const agentToConfig = (agent: AIAgent): AIAgentConfig => {
  return {
    name: agent.name,
    description: agent.description || "",
    modelId: agent.model_id,
    memoryType: agent.memory_type,
    useKnowledgeBase: agent.use_knowledge_base,
    temperature: agent.temperature,
    maxTokens: agent.max_tokens,
    topP: agent.top_p,
    topK: agent.top_k,
    stopSequences: agent.stop_sequences,
    chainType: agent.chain_type,
    chunkSize: agent.chunk_size,
    chunkOverlap: agent.chunk_overlap,
    embeddingModel: agent.embedding_model,
    searchType: agent.search_type,
    searchThreshold: agent.search_threshold,
    outputFormat: agent.output_format,
    tools: agent.tools,
    systemPrompt: agent.system_prompt || "",
  };
};