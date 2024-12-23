import OpenAI from 'openai';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

export class OpenAIService {
  private openai: OpenAI | null = null;
  private initialized: boolean = false;

  private async getOpenAIKey(retryCount = 0): Promise<string> {
    try {
      console.log('Fetching OpenAI key from Edge Function...');
      const { data, error } = await supabase.functions.invoke('get-openai-key');
      
      if (error) throw error;
      if (!data?.key) throw new Error('No API key returned');
      
      return data.key;
    } catch (error) {
      console.error(`Error fetching OpenAI key (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * INITIAL_RETRY_DELAY;
        console.log(`Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.getOpenAIKey(retryCount + 1);
      }
      
      throw new Error('Failed to retrieve OpenAI API key after multiple attempts');
    }
  }

  async initialize(): Promise<boolean> {
    try {
      if (this.initialized) {
        console.log('OpenAI service already initialized');
        return true;
      }

      console.log('Initializing OpenAI service...');
      
      const apiKey = await this.getOpenAIKey();
      
      console.log('Creating OpenAI client...');
      this.openai = new OpenAI({
        apiKey: apiKey
      });
      
      // Test connection
      await this.testConnection();
      
      this.initialized = true;
      console.log('OpenAI service initialized successfully');
      return true;
    } catch (error: any) {
      console.error('OpenAI service initialization failed:', error);
      const errorMessage = error.status === 401 
        ? 'Invalid OpenAI API key. Please check your settings.'
        : 'Failed to initialize OpenAI service. Please try again later.';
      
      toast.error(errorMessage);
      return false;
    }
  }

  private async testConnection(retryCount = 0): Promise<boolean> {
    try {
      console.log('Testing OpenAI connection...');
      if (!this.openai) throw new Error('OpenAI client not initialized');
      
      const response = await this.openai.embeddings.create({
        input: "test",
        model: "text-embedding-3-small"
      });
      
      console.log('OpenAI connection test successful');
      return true;
    } catch (error: any) {
      console.error(`OpenAI connection test failed (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * INITIAL_RETRY_DELAY;
        console.log(`Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.testConnection(retryCount + 1);
      }
      
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.initialized || !this.openai) {
      throw new Error('OpenAI service not initialized');
    }

    let retryCount = 0;
    while (retryCount < MAX_RETRIES) {
      try {
        console.log('Generating embedding for text:', text.substring(0, 100) + '...');
        
        const response = await this.openai.embeddings.create({
          input: text,
          model: "text-embedding-3-small"
        });
        
        console.log('Embedding generated successfully');
        return response.data[0].embedding;
      } catch (error) {
        console.error(`Error generating embedding (attempt ${retryCount + 1}):`, error);
        
        retryCount++;
        if (retryCount === MAX_RETRIES) throw error;
        
        const delay = Math.pow(2, retryCount) * INITIAL_RETRY_DELAY;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Failed to generate embedding after retries');
  }
}