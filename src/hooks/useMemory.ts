import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ConversationSummaryMemory } from "langchain/memory";
import { supabase } from "@/integrations/supabase/client";
import { ChatOpenAI } from "@langchain/openai";

export const useMemory = (conversationId: string) => {
  const initializeMemory = async () => {
    const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not found");
    }

    const vectorStore = new SupabaseVectorStore(
      new OpenAIEmbeddings({
        openAIApiKey,
      }), 
      {
        client: supabase,
        tableName: 'documents',
        queryName: 'match_documents'
      }
    );

    const memory = new ConversationSummaryMemory({
      memoryKey: "chat_history",
      llm: new ChatOpenAI({ 
        modelName: "gpt-4o-mini", 
        temperature: 0,
        openAIApiKey,
      }),
      returnMessages: true,
      inputKey: "input",
      outputKey: "output",
    });

    return memory;
  };

  return {
    initializeMemory,
  };
};