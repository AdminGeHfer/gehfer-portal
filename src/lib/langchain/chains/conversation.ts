import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "@langchain/core/prompts";

export const createConversationChain = (
  llm: ChatOpenAI,
  memory: BufferMemory,
  systemPrompt: string = "You are a helpful assistant."
) => {
  const prompt = PromptTemplate.fromTemplate(`
    ${systemPrompt}
    
    Current conversation:
    {chat_history}
    
    Human: {input}
    Assistant: `);

  return new ConversationChain({
    llm,
    memory,
    prompt,
  });
};