export class ChunkingService {
  createChunks(
    text: string,
    chunkSize: number,
    overlap: number
  ): string[] {
    const chunks: string[] = [];
    const words = text.split(/\s+/);
    
    let currentChunk: string[] = [];
    let currentLength = 0;

    for (const word of words) {
      if (currentLength + word.length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
        
        // Keep overlap words for next chunk
        const overlapWords = currentChunk.slice(-Math.floor(overlap / 5));
        currentChunk = [...overlapWords];
        currentLength = overlapWords.join(' ').length;
      }

      currentChunk.push(word);
      currentLength += word.length + 1; // +1 for space
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
    }

    return chunks;
  }
}
