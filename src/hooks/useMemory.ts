import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ConversationSummaryMemory } from "langchain/memory";
import { supabase } from "@/integrations/supabase/client";
import { ChatOpenAI } from "@langchain/openai";

export const useMemory = (conversationId: string) => {
  const initializeMemory = async () => {
    console.log('Initializing memory and retrieving OpenAI API key...');
    
    try {
      // First, let's verify if we can make the RPC call
      console.log('Attempting to retrieve OpenAI API key from Supabase secrets...');
      const { data: secretData, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'OPENAI_API_KEY')
        .single();

      if (secretError) {
        console.error('Error fetching OpenAI API key:', secretError);
        throw new Error(`Failed to retrieve OpenAI API key: ${secretError.message}`);
      }

      if (!secretData?.value) {
        console.error('OpenAI API key not found');
        throw new Error("OpenAI API key not found. Please add it in the Supabase settings.");
      }

      const openAIApiKey = secretData.value;
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