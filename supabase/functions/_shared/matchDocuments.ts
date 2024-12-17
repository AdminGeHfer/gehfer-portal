export const validateChunkRelevance = (similarity: number, threshold: number = 0.8): boolean => {
  return similarity >= threshold;
};

export const parseClassification = (content: string) => {
  const classifications = content.split('|').map(part => part.trim());
  if (classifications.length >= 3) {
    return {
      description: classifications[0],
      base: classifications[1],
      group: classifications[2],
      valid: true
    };
  }
  return { valid: false };
};

export const structureChunkContent = (chunks: any[]): string => {
  return chunks
    .sort((a, b) => b.similarity - a.similarity)
    .map(chunk => {
      // Split content by newlines to handle multiple classifications
      const classifications = chunk.content.split('\n');
      
      // Parse and validate each classification
      const validClassifications = classifications
        .map(c => {
          const parsed = parseClassification(c);
          if (parsed.valid) {
            return `CLASSIFICAÇÃO:
Descrição: ${parsed.description}
Base: ${parsed.base}
Grupo: ${parsed.group}
Relevância: ${chunk.similarity.toFixed(2)}
---`;
          }
          return null;
        })
        .filter(Boolean);

      return validClassifications.join('\n\n');
    })
    .join('\n\n');
};