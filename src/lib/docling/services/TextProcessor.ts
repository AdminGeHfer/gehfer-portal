export class TextProcessor {
  async extractText(file: File): Promise<string> {
    return await file.text();
  }

  async generateSemanticChunks(content: string): Promise<string[]> {
    const chunks: string[] = [];
    const sentences = content.split(/[.!?]+/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > 1000) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  async calculateCoherence(text: string): Promise<number> {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    if (sentences.length <= 1) return 1.0;

    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    const deviation = sentences.reduce((sum, s) => sum + Math.abs(s.length - avgLength), 0) / sentences.length;
    
    return Math.max(0, Math.min(1, 1 - (deviation / avgLength)));
  }

  async countTokens(text: string): Promise<number> {
    return text.split(/\s+/).length;
  }
}