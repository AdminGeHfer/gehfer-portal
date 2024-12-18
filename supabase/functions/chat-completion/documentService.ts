/* @ai-optimized
 * version: "2.0"
 * last-update: "2024-03-19"
 * features: ["semantic-search", "dynamic-threshold"]
 * checksum: "a1b2c3d4e5"
 */

import { supabase } from './supabaseClient.ts';

export async function findRelevantDocuments(
  embedding: number[],
  searchThreshold = 0.3
) {
  try {
    console.log('Searching documents with threshold:', searchThreshold);
    
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
      console.log('No relevant documents found');
      return { 
        documents: [], 
        metaKnowledge: 'Não foram encontrados documentos relevantes na base de conhecimento.' 
      };
    }

    console.log(`Found ${documents.length} relevant documents`);
    console.log('Similarity scores:', documents.map(d => d.similarity));

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