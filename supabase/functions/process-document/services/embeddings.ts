import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";
import { withRetry } from "../utils/retry.ts";

export class EmbeddingsService {
  private openai: OpenAIApi;

  constructor() {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('Missing OpenAI API key');
    }

    this.openai = new OpenAIApi(new Configuration({ apiKey: openaiApiKey }));
  }

  async generateEmbedding(text: string): Promise<number[]> {
    return await withRetry(async () => {
      const response = await this.openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: text,
      });

      if (!response.data?.data?.[0]?.embedding) {
        throw new Error('Failed to generate embedding');
      }

      return response.data.data[0].embedding;
    });
  }
}