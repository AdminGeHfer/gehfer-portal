/* @ai-protected
 * type: "agent-config"
 * status: "optimized"
 * version: "2.0"
 * features: [
 *   "dynamic-configuration",
 *   "model-mapping",
 *   "prompt-templates"
 * ]
 * last-modified: "2024-03-13"
 * checksum: "d9c4b3a2e1"
 * do-not-modify: true
 */

import { AIAgent } from "@/types/ai/agent";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const MODEL_MAPPING = {
  'gpt-4o': 'gpt-4-0125-preview',
  'gpt-4o-mini': 'gpt-4-turbo-preview',
  'gpt-3.5-turbo-16k': 'gpt-3.5-turbo-16k',
};

export const createLLMFromConfig = (config: AIAgent) => {
  console.log('Creating LLM with config:', {
    modelName: config.model_id,
    temperature: config.temperature,
    maxTokens: config.max_tokens,
    topP: config.top_p,
  });

  const modelName = MODEL_MAPPING[config.model_id] || 'gpt-4-turbo-preview';

  return new ChatOpenAI({
    modelName,
    temperature: config.temperature,
    maxTokens: config.max_tokens,
    topP: config.top_p,
  });
};

export const createPromptTemplate = (config: AIAgent) => {
  console.log('Creating prompt template with system prompt:', config.system_prompt);

  return PromptTemplate.fromTemplate(`
    ${config.system_prompt || "You are a helpful AI assistant."}
    
    Current conversation:
    {chat_history}
    
    Human: {input}
    Assistant: Let me help you with that.
  `);
};