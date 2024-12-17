export const validateChunkRelevance = (similarity: number, threshold: number = 0.8): boolean => {
  return similarity >= threshold;
};

export const structureChunkContent = (chunks: any[]): string => {
  return chunks
    .sort((a, b) => b.similarity - a.similarity)
    .map(chunk => `
CLASSIFICATION:
${chunk.content}
Relevance: ${chunk.similarity.toFixed(2)}
---
    `.trim())
    .join('\n\n');
};