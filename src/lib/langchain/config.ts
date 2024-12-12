import { ChatOpenAI } from "@langchain/openai";

// Configuração base do modelo
export const createChatModel = (modelName: string = "gpt-3.5-turbo", temperature: number = 0.7) => {
  return new ChatOpenAI({
    modelName,
    temperature,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
};