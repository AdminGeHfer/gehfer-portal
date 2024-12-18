export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export interface ChatConfig {
  messages: Array<{
    role: string;
    content: string;
  }>;
  model: string;
  systemPrompt?: string;
  useKnowledgeBase?: boolean;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  agentId?: string;
  searchThreshold?: number;
}