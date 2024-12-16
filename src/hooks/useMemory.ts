import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ConversationSummaryMemory } from "langchain/memory";
import { supabase } from "@/integrations/supabase/client";
import { ChatOpenAI } from "@langchain/openai";

export const useMemory = (conversationId: string) => {
  const initializeMemory = async () => {
    const vectorStore = new SupabaseVectorStore(
      new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      }), 
      {
        client: supabase,
        tableName: 'documents',
        queryName: 'match_documents'
      }
    );

    const memory = new ConversationSummaryMemory({
      memoryKey: "chat_history",
      llm: new ChatOpenAI({ modelName: "gpt-4", temperature: 0 }),
      returnMessages: true,
      inputKey: "input",
      outputKey: "output",
    });

    return memory;
  };

  const logInteraction = async (input: string, response: string, metrics: any) => {
    try {
      const { error } = await supabase
        .from('ai_agent_logs')
        .insert({
          conversation_id: conversationId,
          event_type: 'interaction',
          details: input,
          configuration: {
            input,
            response,
            metrics
          }
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging interaction:', error);
    }
  };

  return {
    initializeMemory,
    logInteraction
  };
};