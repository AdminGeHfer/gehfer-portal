import OpenAI from 'openai';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export class OpenAIService {
  private openai: OpenAI | null = null;
  private initialized: boolean = false;

  async initialize(): Promise<boolean> {
    try {
      if (this.initialized) return true;

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
        toast.error('OpenAI API key not found. Please add it in the settings.');
        return false;
      }

      this.openai = new OpenAI({
        apiKey: secrets.value
      });
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing OpenAI:', error);
      toast.error('Failed to initialize OpenAI client');
      return false;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.initialized || !this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      const response = await this.openai.embeddings.create({
        input: text,
        model: "text-embedding-3-small"
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }
}