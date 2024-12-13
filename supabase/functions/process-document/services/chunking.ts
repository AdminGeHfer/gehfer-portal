export class ChunkingService {
  createChunks(
    text: string,
    chunkSize: number = 1000,
    overlap: number = 200
  ): { content: string; metadata: any }[] {
    console.log(`Creating chunks with size ${chunkSize} and overlap ${overlap}`);
    
    // Normalize text
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    
    const chunks: { content: string; metadata: any }[] = [];
    const words = normalizedText.split(' ');
    
    let currentChunk: string[] = [];
    let currentLength = 0;
    let position = 0;

    for (const word of words) {
      if (currentLength + word.length > chunkSize && currentChunk.length > 0) {
        // Store current chunk
        chunks.push({
          content: currentChunk.join(' '),
          metadata: {
            position,
            length: currentChunk.length
          }
        });
        
        // Keep overlap words for next chunk
        const overlapWords = currentChunk.slice(-Math.floor(overlap / 10));
        currentChunk = [...overlapWords];
        currentLength = overlapWords.join(' ').length;
        position += currentChunk.length;
      }

      currentChunk.push(word);
      currentLength += word.length + 1; // +1 for space
    }

    // Add final chunk if exists
    if (currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.join(' '),
        metadata: {
          position,
          length: currentChunk.length
        }
      });
    }

    console.log(`Created ${chunks.length} chunks`);
    return chunks;
  }
}
