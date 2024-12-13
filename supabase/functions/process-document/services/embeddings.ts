import { ProcessingMetrics } from "../utils/metrics.ts";
import { withRetry } from "../utils/retry.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const EMBEDDING_MODEL = 'text-embedding-3-small';

export class EmbeddingsService {
  private metrics: ProcessingMetrics;

  constructor(metrics: ProcessingMetrics) {
    this.metrics = metrics;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    console.log(`Generating embedding for text of length ${text.length}`);
    
    return await withRetry(async () => {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          model: EMBEDDING_MODEL,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API error:', error);
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      this.metrics.trackMetric('embedding_tokens_used', data.usage?.total_tokens || 0);
      
      return data.data[0].embedding;
    });
  }
}