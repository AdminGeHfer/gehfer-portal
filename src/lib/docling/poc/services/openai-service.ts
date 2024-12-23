import OpenAI from 'openai';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export class OpenAIService {
  private openai: OpenAI | null = null;
  private initialized: boolean = false;

  async initialize(): Promise<boolean> {
    try {
      if (this.initialized) return true;

      console.log('Initializing OpenAI service...');

      const { data: secrets, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'OPENAI_API_KEY')
        .maybeSingle();

      if (error) {
        console.error('Error fetching OpenAI API key:', error);
        toast.error('Failed to initialize OpenAI client');
        return false;
      }

      if (!secrets?.value) {
        console.error('OpenAI API key not found');
        toast.error('OpenAI API key not found. Please add it in settings.');
        return false;
      }

      this.openai = new OpenAI({
        apiKey: secrets.value
      });
      
      this.initialized = true;
      console.log('OpenAI service initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing OpenAI:', error);
      toast.error('Failed to initialize OpenAI client');
      return false;
    }
  }

  private async retry<T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying operation. Attempts remaining: ${retries - 1}`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return this.retry(operation, retries - 1);
      }
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.initialized || !this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      console.log('Generating embedding for text:', text.substring(0, 100) + '...');
      
      const response = await this.retry(async () => {
        return await this.openai!.embeddings.create({
          input: text,
          model: "text-embedding-3-small"
        });
      });

      console.log('Embedding generated successfully');
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }
}