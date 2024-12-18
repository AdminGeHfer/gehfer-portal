import { supabase } from './supabaseClient.ts';

export async function findRelevantDocuments(
  embedding: number[],
  searchThreshold = 0.5
) {
  try {
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: searchThreshold,
      match_count: 8
    });

    if (error) {
      console.error('Error finding relevant documents:', error);
      return { documents: [], metaKnowledge: '' };
    }

    if (!documents || documents.length === 0) {
      return { 
        documents: [], 
        metaKnowledge: 'Não foram encontrados documentos relevantes na base de conhecimento.' 
      };
    }

    const metaKnowledge = `Encontrados ${documents.length} documentos relevantes com similaridade entre ${
      Math.round(documents[documents.length - 1].similarity * 100) / 100
    } e ${
      Math.round(documents[0].similarity * 100) / 100
    }.`;

    return { documents, metaKnowledge };
  } catch (error) {
    console.error('Error in findRelevantDocuments:', error);
    return { documents: [], metaKnowledge: '' };
  }
}