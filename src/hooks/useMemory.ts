import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ConversationSummaryMemory } from "langchain/memory";
import { supabase } from "@/integrations/supabase/client";
import { ChatOpenAI } from "@langchain/openai";

export const useMemory = (conversationId: string) => {
  const initializeMemory = async () => {
    console.log('Initializing memory and retrieving OpenAI API key...');
    
    try {
      // Primeiro, vamos verificar se conseguimos fazer a chamada RPC
      console.log('Attempting to retrieve OpenAI API key from Supabase secrets...');
      const { data, error } = await supabase
        .rpc('get_secret', { secret_name: 'OPENAI_API_KEY' });

      if (error) {
        console.error('Error fetching OpenAI API key:', error);
        throw new Error(`Failed to retrieve OpenAI API key: ${error.message}`);
      }

      console.log('API key response:', data); // Log the response structure

      if (!data || !data[0]) {
        console.error('No data returned from get_secret');
        throw new Error("No data returned from get_secret RPC call");
      }

      if (!data[0].secret) {
        console.error('Secret value is null or undefined');
        throw new Error("Secret value is null or undefined in the response");
      }

      const openAIApiKey = data[0].secret;
      console.log('OpenAI API key retrieved successfully');

      // Initialize vector store with retry mechanism
      let vectorStore;
      try {
        console.log('Initializing vector store...');
        vectorStore = new SupabaseVectorStore(
          new OpenAIEmbeddings({
            openAIApiKey,
            modelName: "text-embedding-3-small"
          }), 
          {
            client: supabase,
            tableName: 'documents',
            queryName: 'match_documents'
          }
        );
        console.log('Vector store initialized successfully');
      } catch (vectorError) {
        console.error('Error initializing vector store:', vectorError);
        throw new Error(`Failed to initialize vector store: ${vectorError.message}`);
      }

      // Initialize memory with proper error handling
      try {
        console.log('Initializing conversation memory...');
        const memory = new ConversationSummaryMemory({
          memoryKey: "chat_history",
          llm: new ChatOpenAI({ 
            modelName: "gpt-3.5-turbo",
            temperature: 0,
            openAIApiKey,
          }),
          returnMessages: true,
          inputKey: "input",
          outputKey: "output",
        });
        console.log('Memory initialized successfully');
        return memory;
      } catch (memoryError) {
        console.error('Error initializing memory:', memoryError);
        throw new Error(`Failed to initialize chat memory: ${memoryError.message}`);
      }
    } catch (error) {
      console.error('Fatal error in memory initialization:', error);
      throw error;
    }
  };

  return {
    initializeMemory,
  };
};