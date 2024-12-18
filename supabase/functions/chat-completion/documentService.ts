import { supabase } from './supabaseClient.ts';

export async function findRelevantDocuments(
  embedding: number[],
  searchThreshold = 0.3
) {
  try {
    console.log('Starting document search with:', {
      embeddingSize: embedding.length,
      threshold: searchThreshold
    });
    
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: searchThreshold,
      match_count: 8
    });

    if (error) {
      console.error('Error in document search:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      return { documents: [], metaKnowledge: '' };
    }

    if (!documents || documents.length === 0) {
      console.log('No documents found matching criteria');
      return { 
        documents: [], 
        metaKnowledge: 'Não foram encontrados documentos relevantes na base de conhecimento.' 
      };
    }

    console.log('Document search results:', {
      count: documents.length,
      similarities: documents.map(d => d.similarity),
      metadata: documents.map(d => d.metadata)
    });

    const metaKnowledge = `Encontrados ${documents.length} documentos relevantes com similaridade entre ${
      Math.round(documents[documents.length - 1].similarity * 100) / 100
    } e ${
      Math.round(documents[0].similarity * 100) / 100
    }.`;

    return { documents, metaKnowledge };
  } catch (error) {
    console.error('Unexpected error in findRelevantDocuments:', error);
    console.error('Stack trace:', error.stack);
    return { documents: [], metaKnowledge: '' };
  }
}