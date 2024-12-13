import { Configuration, OpenAIApi } from "https://esm.sh/openai@4.26.0";
import { withRetry } from "../utils/retry.ts";

export class EmbeddingsService {
  private openai: OpenAIApi;

  constructor() {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('Missing OpenAI API key');
    }

    const configuration = new Configuration({ apiKey: openaiApiKey });
    this.openai = new OpenAIApi(configuration);
  }

  async generateEmbedding(text: string): Promise<number[]> {
    return await withRetry(async () => {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
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
      return data.data[0].embedding;
    });
  }
}