import OpenAI from 'openai';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export class OpenAIService {
  private openai: OpenAI | null = null;
  private initialized: boolean = false;

  async initialize(): Promise<boolean> {
    try {
      if (this.initialized) return true;

      console.log('Initializing OpenAI service...');

      // Fetch API key from Supabase secrets
      const { data: secrets, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'OPENAI_API_KEY')
        .maybeSingle();

      if (error) {
        console.error('Error fetching OpenAI API key:', error);
        toast.error('Failed to fetch OpenAI API key from settings');
        return false;
      }

      if (!secrets?.value) {
        console.error('OpenAI API key not found in secrets');
        toast.error('OpenAI API key not found. Please add it in settings.');
        return false;
      }

      // Test the API key before proceeding
      try {
        console.log('Creating OpenAI client with provided key...');
        this.openai = new OpenAI({
          apiKey: secrets.value
        });
        
        // Test API connection with retries
        let retryCount = 0;
        while (retryCount < MAX_RETRIES) {
          try {
            await this.testConnection();
            console.log('OpenAI connection test successful');
            break;
          } catch (error: any) {
            retryCount++;
            console.log(`Connection test failed, attempt ${retryCount} of ${MAX_RETRIES}`);
            
            // Check if the error is due to an invalid API key
            if (error.status === 401) {
              console.error('Invalid OpenAI API key');
              toast.error('Invalid OpenAI API key. Please check your settings.');
              return false;
            }
            
            if (retryCount === MAX_RETRIES) {
              throw error;
            }
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          }
        }
        
        this.initialized = true;
        console.log('OpenAI service initialized successfully');
        toast.success('OpenAI service initialized successfully');
        return true;
      } catch (error: any) {
        console.error('Error initializing OpenAI client:', error);
        const errorMessage = error.response?.data?.error?.message || 'Failed to initialize OpenAI service';
        toast.error(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Error in OpenAI service initialization:', error);
      toast.error('Failed to initialize OpenAI service');
      return false;
    }
  }

  private async testConnection(): Promise<boolean> {
    try {
      console.log('Testing OpenAI connection...');
      const response = await this.openai!.embeddings.create({
        input: "test",
        model: "text-embedding-3-small"
      });
      console.log('OpenAI connection test successful:', response);
      return true;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.initialized || !this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      console.log('Generating embedding for text:', text.substring(0, 100) + '...');
      
      let retryCount = 0;
      while (retryCount < MAX_RETRIES) {
        try {
          const response = await this.openai.embeddings.create({
            input: text,
            model: "text-embedding-3-small"
          });
          console.log('Embedding generated successfully');
          return response.data[0].embedding;
        } catch (error) {
          retryCount++;
          console.log(`Retry ${retryCount} of ${MAX_RETRIES}`);
          if (retryCount === MAX_RETRIES) throw error;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
      throw new Error('Failed to generate embedding after retries');
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }
}