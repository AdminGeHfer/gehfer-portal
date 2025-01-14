import { supabase } from '@/integrations/supabase/client';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

export class OpenAIService {
  private initialized: boolean = false;

  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing OpenAI service...');
      
      // Test connection through Edge Function
      const { data, error } = await supabase.functions.invoke('process-openai', {
        body: { action: 'test' }
      });

      if (error) throw error;
      if (!data?.success) throw new Error('Failed to initialize OpenAI service');
      
      this.initialized = true;
      console.log('OpenAI service initialized successfully');
      return true;
    } catch (error) {
      console.error('OpenAI service initialization failed:', error);
      throw new Error('Failed to initialize OpenAI service. Please check your API key.');
    }
  }

  async generateEmbedding(text: string, retryCount = 0): Promise<number[]> {
    if (!this.initialized) {
      throw new Error('OpenAI service not initialized');
    }

    try {
      console.log('Generating embedding for text:', text.substring(0, 100) + '...');
      
      const { data, error } = await supabase.functions.invoke('process-openai', {
        body: { 
          action: 'embedding',
          content: text
        }
      });

      if (error) throw error;
      if (!data?.embedding) throw new Error('No embedding returned');

      console.log('Embedding generated successfully');
      return data.embedding;
    } catch (error) {
      console.error(`Error generating embedding (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * INITIAL_RETRY_DELAY;
        console.log(`Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.generateEmbedding(text, retryCount + 1);
      }
      
      throw error;
    }
  }
}