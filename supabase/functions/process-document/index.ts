import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import OpenAI from "https://esm.sh/openai@4.24.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const formData = await req.formData();
    const file = formData.get('file');
    const agentId = formData.get('agentId');

    if (!file) {
      throw new Error('No file provided');
    }

    const content = await file.text();
    const chunks = splitIntoChunks(content, 1000, 200);
    
    console.log(`Processing ${chunks.length} chunks`);
    
    const processedChunks = await Promise.all(
      chunks.map(async (chunk, index) => {
        const embedding = await generateEmbedding(openai, chunk);
        return {
          content: chunk,
          embedding,
          metadata: {
            position: index,
            processingTime: Date.now(),
          }
        };
      })
    );

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert({
        metadata: {
          filename: file.name,
          contentType: file.type,
          size: file.size,
          processor: 'edge-function',
          version: '1.0'
        },
        processed: true
      })
      .select()
      .single();

    if (documentError) throw documentError;

    const { error: chunksError } = await supabase
      .from('document_chunks')
      .insert(
        processedChunks.map(chunk => ({
          document_id: documentData.id,
          content: chunk.content,
          embedding: chunk.embedding,
          metadata: chunk.metadata
        }))
      );

    if (chunksError) throw chunksError;

    if (agentId) {
      const { error: assocError } = await supabase
        .from('ai_agent_documents')
        .insert({
          agent_id: agentId,
          document_id: documentData.id
        });

      if (assocError) throw assocError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        documentId: documentData.id,
        chunksCount: processedChunks.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function generateEmbedding(openai: OpenAI, text: string) {
  const response = await openai.embeddings.create({
    input: text,
    model: 'text-embedding-3-small'
  });
  return response.data[0].embedding;
}

function splitIntoChunks(text: string, size: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }
  
  return chunks;
}