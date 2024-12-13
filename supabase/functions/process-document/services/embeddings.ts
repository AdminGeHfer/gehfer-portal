import { OpenAIEmbeddingResponse } from '../types/openai';

export class EmbeddingsService {
  private apiKey: string;
  private cache: Map<string, number[]>;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.cache = new Map();
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Check cache first
    const cacheKey = this.hashText(text);
    if (this.cache.has(cacheKey)) {
      console.log('Cache hit for embedding');
      return this.cache.get(cacheKey)!;
    }

    try {
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
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenAIEmbeddingResponse = await response.json();
      const embedding = data.data[0].embedding;

      // Cache the result
      this.cache.set(cacheKey, embedding);

      return embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  private hashText(text: string): string {
    // Simple hash function for cache keys
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }
}