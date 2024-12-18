import { supabase } from './supabaseClient.ts';

export async function findRelevantDocuments(embedding: number[], threshold: number = 0.5, limit: number = 8) {
  try {
    const { data: documents, error } = await supabase.rpc(
      'match_documents',
      {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit
      }
    );

    if (error) throw error;

    return {
      documents,
      metaKnowledge: generateMetaKnowledge(documents)
    };
  } catch (error) {
    console.error('Error finding relevant documents:', error);
    throw error;
  }
}

function generateMetaKnowledge(documents: any[]) {
  if (!documents?.length) {
    return 'Nenhum documento relevante encontrado na base de conhecimento.';
  }

  const avgSimilarity = documents.reduce((acc, doc) => acc + doc.similarity, 0) / documents.length;

  return `
Informações sobre a busca:
- Total de documentos encontrados: ${documents.length}
- Melhor score de relevância: ${(Math.max(...documents.map(d => d.similarity)) * 100).toFixed(1)}%
- Score médio de relevância: ${(avgSimilarity * 100).toFixed(1)}%`;
}