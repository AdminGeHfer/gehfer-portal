import { supabase } from "@/integrations/supabase/client";
import OpenAI from "openai";

export class OpenAIService {
  private openai: OpenAI | null = null;

  async initialize(): Promise<OpenAI> {
    try {
      const { data: secrets, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'OPENAI_API_KEY')
        .maybeSingle();

      if (error) throw error;
      if (!secrets?.value) {
        throw new Error(
          "OpenAI API key not found in Supabase secrets. Please add it in the project settings."
        );
      }

      this.openai = new OpenAI({
        apiKey: secrets.value,
      });

      return this.openai;
    } catch (error: any) {
      console.error('Error initializing OpenAI:', error);
      if (error.message.includes('contains 0 rows')) {
        throw new Error(
          "OpenAI API key not found in Supabase secrets. Please add it in the project settings."
        );
      }
      throw new Error("Failed to initialize OpenAI client. Please ensure the API key is set in Supabase secrets.");
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.openai) {
      throw new Error("OpenAI service not initialized");
    }

    const response = await this.openai.embeddings.create({
      input: text,
      model: 'text-embedding-3-small'
    });

    return response.data[0].embedding;
  }
}