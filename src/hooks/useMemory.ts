import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ConversationSummaryMemory } from "langchain/memory";
import { supabase } from "@/integrations/supabase/client";
import { ChatOpenAI } from "@langchain/openai";

export const useMemory = (conversationId: string) => {
  const initializeMemory = async () => {
    const { data: { secret: openAIApiKey } } = await supabase
      .rpc('get_secret', { secret_name: 'OPENAI_API_KEY' });
    
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not found in Supabase secrets. Please add it using the form above.");
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