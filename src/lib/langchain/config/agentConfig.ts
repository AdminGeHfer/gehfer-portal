import { AIAgent } from "@/types/ai/agent";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

export const createLLMFromConfig = (config: AIAgent) => {
  console.log('Creating LLM with config:', {
    modelName: config.model_id,
    temperature: config.temperature,
    maxTokens: config.max_tokens,
    topP: config.top_p,
  });

  return new ChatOpenAI({
    modelName: config.model_id === 'gpt-4o' ? 'gpt-4' : 'gpt-3.5-turbo',
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