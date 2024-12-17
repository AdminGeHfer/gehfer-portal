export const validateChunkRelevance = (similarity: number, threshold: number = 0.8): boolean => {
  return similarity >= threshold;
};

export const parseClassification = (content: string) => {
  const parts = content.split('|');
  if (parts.length >= 3) {
    return {
      description: parts[0].trim(),
      base: parts[1].trim(),
      group: parts[2].trim(),
      valid: true
    };
  }
  return { valid: false };
};

export const structureContext = (chunks: any[]): string => {
  const validClassifications = chunks
    .sort((a, b) => b.similarity - a.similarity)
    .map(chunk => {
      const lines = chunk.content.split('\n');
      return lines
        .map(line => {
          const parsed = parseClassification(line);
          if (parsed.valid) {
            return `CLASSIFICAÇÃO:\n` +
                   `Descrição: ${parsed.description}\n` +
                   `Base: ${parsed.base}\n` +
                   `Grupo: ${parsed.group}\n` +
                   `Relevância: ${chunk.similarity.toFixed(2)}\n` +
                   `---`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n\n');
    })
    .filter(Boolean)
    .join('\n\n');

  return validClassifications || 'Nenhuma classificação encontrada.';
};

export const validateChunks = (chunks: any[], threshold: number = 0.8) => {
  return chunks.filter(chunk => {
    const isValid = validateChunkRelevance(chunk.similarity, threshold);
    console.log(`Chunk validation: similarity=${chunk.similarity}, threshold=${threshold}, isValid=${isValid}`);
    return isValid;
  });
};