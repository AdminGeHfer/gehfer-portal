/* @ai-protected
 * type: "agent-config"
 * status: "optimized"
 * version: "2.1"
 * features: [
 *   "model-mapping",
 *   "prompt-templates",
 *   "knowledge-base-settings"
 * ]
 * checksum: "d9c4b3a2e1"
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
  console.log('[AgentConfig] Creating LLM with config:', {
    modelName: config.model_id,
    temperature: config.temperature,
    maxTokens: config.max_tokens,
    topP: config.top_p,
    useKnowledgeBase: config.use_knowledge_base
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
  console.log('[AgentConfig] Creating prompt template');
  
  let systemPrompt = config.system_prompt || "You are a helpful AI assistant.";
  
  if (config.use_knowledge_base) {
    systemPrompt += `
    
I have access to a knowledge base and will use it to provide accurate information.
When answering questions, I will:
1. Consider the context provided from the knowledge base
2. Cite relevant information from the context
3. Maintain accuracy and relevance to the query
4. Clearly indicate when I'm using information from the knowledge base
`;
  }

  return PromptTemplate.fromTemplate(`
    ${systemPrompt}
    
    Current conversation:
    {chat_history}
    
    ${config.use_knowledge_base ? 'Relevant context from knowledge base:\n{context}\n\n' : ''}
    
    Human: {input}
    Assistant: Let me help you with that.
  `);
};