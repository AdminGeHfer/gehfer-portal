import { supabase } from "@/integrations/supabase/client";

export class OpenAIService {
  private initialized = false;

  async initialize(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke("process-openai", {
        body: { action: "test" },
      });
      if (error) throw error;
      if (!data?.success) throw new Error("OpenAI validation failed");

      this.initialized = true;
      return true;
    } catch (error) {
      console.error("Error initializing OpenAI service", error);
      throw new Error("Failed to initialize OpenAI service.");
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.initialized) {
      throw new Error("OpenAI service not initialized");
    }

    if (!text || text.trim().length < 1) {
      throw new Error("Invalid input text");
    }

    const { data, error } = await supabase.functions.invoke("process-openai", {
      body: {
        action: "embedding",
        content: text,
      },
    });
    if (error) throw error;
    if (!data?.embedding) throw new Error("No embedding returned");

    return data.embedding as number[];
  }
}
