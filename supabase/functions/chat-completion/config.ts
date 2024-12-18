/* @ai-optimized
 * version: "2.0"
 * last-update: "2024-03-19"
 * features: ["knowledge-base", "dynamic-threshold"]
 * checksum: "d9c4b3a2e1"
 */

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