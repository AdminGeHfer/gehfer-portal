export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

export type ChatMessage = {
  role: string;
  content: string;
  created_at?: string;
};

export type ChatConfig = {
  messages: ChatMessage[];
  model: string;
  systemPrompt?: string;
  useKnowledgeBase?: boolean;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  agentId?: string;
  searchThreshold?: number;
};