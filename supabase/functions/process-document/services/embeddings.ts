import { Configuration, OpenAIApi } from "https://esm.sh/@langchain/openai@0.0.14";

export class EmbeddingsService {
  private apiKey: string;

  constructor() {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('Missing OpenAI API key');
    }
    this.apiKey = apiKey;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      console.log('Generating embedding for text:', text.substring(0, 100) + '...');
      
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          model: 'text-embedding-ada-002',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Successfully generated embedding');
      return data.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }
}