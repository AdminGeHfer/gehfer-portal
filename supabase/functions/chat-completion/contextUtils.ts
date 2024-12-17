import { validateChunkRelevance } from '../_shared/matchDocuments.ts';

export const structureContext = (chunks: any[]) => {
  if (!chunks || chunks.length === 0) return '';
  
  return chunks.map(chunk => {
    return `CLASSIFICATION ENTRY:\nDescription: ${chunk.content}\nRelevance Score: ${chunk.similarity}\n---\n`;
  }).join('\n');
};

export const validateChunks = (chunks: any[], threshold: number = 0.8) => {
  return chunks.filter(chunk => {
    const isValid = validateChunkRelevance(chunk.similarity, threshold);
    console.log(`Chunk validation: similarity=${chunk.similarity}, threshold=${threshold}, isValid=${isValid}`);
    return isValid;
  });
};