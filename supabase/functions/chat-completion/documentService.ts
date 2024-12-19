import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function findRelevantDocuments(
  embedding: number[],
  searchThreshold: number = 0.4,
  agentId?: string
) {
  console.log('DocumentService: Searching for relevant documents');
  console.log('DocumentService: Search threshold:', searchThreshold);
  console.log('DocumentService: Agent ID:', agentId);

  try {
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: searchThreshold,
      match_count: 5,
      p_agent_id: agentId
    });

    if (error) {
      console.error('DocumentService: Error searching documents:', error);
      throw error;
    }

    console.log('DocumentService: Found documents:', documents?.length || 0);
    
    if (documents && documents.length > 0) {
      console.log('DocumentService: Top match scores:', 
        documents.slice(0, 3).map(d => ({
          similarity: d.similarity,
          preview: d.content.substring(0, 100)
        }))
      );
    }

    const metaKnowledge = documents && documents.length > 0
      ? `Encontrei ${documents.length} documentos relevantes com scores de similaridade entre ${
          Math.min(...documents.map(d => d.similarity)).toFixed(2)
        } e ${
          Math.max(...documents.map(d => d.similarity)).toFixed(2)
        }.`
      : 'Não encontrei documentos relevantes na base de conhecimento.';

    return {
      documents: documents || [],
      metaKnowledge
    };
  } catch (error) {
    console.error('DocumentService: Error in findRelevantDocuments:', error);
    throw error;
  }
}