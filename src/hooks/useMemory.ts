import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ConversationSummaryMemory } from "langchain/memory";
import { supabase } from "@/integrations/supabase/client";
import { ChatOpenAI } from "@langchain/openai";
import { useToast } from "@/hooks/use-toast";

export const useMemory = (conversationId: string) => {
  const { toast } = useToast();

  const initializeMemory = async () => {
    console.log('Initializing memory and retrieving OpenAI API key...');
    
    try {
      // Get OpenAI API key directly from Edge Function
      const { data: response, error: apiError } = await supabase.functions.invoke('get-openai-key', {
        body: {}
      });

      if (apiError) {
        console.error('Error fetching OpenAI API key:', apiError);
        throw new Error(`Failed to retrieve OpenAI API key: ${apiError.message}`);
      }

      if (!response?.apiKey) {
        console.error('OpenAI API key not found');
        throw new Error("OpenAI API key not found. Please add it in the Supabase settings.");
      }

      const openAIApiKey = response.apiKey;
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

        // Add vector store to memory context
        const memoryWithKnowledge = {
          ...memory,
          vectorStore
        };

        return memoryWithKnowledge;
      } catch (memoryError) {
        console.error('Error initializing memory:', memoryError);
        throw new Error(`Failed to initialize chat memory: ${memoryError.message}`);
      }
    } catch (error: any) {
      console.error('Fatal error in memory initialization:', error);
      
      // Show a user-friendly toast message
      toast({
        title: "Error Initializing Chat",
        description: error.message || "An error occurred while setting up the chat. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return {
    initializeMemory,
  };
};