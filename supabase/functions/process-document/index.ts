import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import OpenAI from "https://esm.sh/openai@4.24.1"
import { CONFIG, CORS_HEADERS } from "./config.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    console.log('Starting document processing');
    
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
    console.log(`Content length: ${content.length} characters`);

    // Process in smaller chunks to manage memory better
    const chunks = splitIntoChunks(content, CONFIG.CHUNK_SIZE, CONFIG.CHUNK_OVERLAP);
    console.log(`Split into ${chunks.length} chunks`);
    
    const processedChunks = [];
    
    // Process chunks in batches to avoid memory issues
    for (let i = 0; i < chunks.length; i += CONFIG.BATCH_SIZE) {
      const batch = chunks.slice(i, i + CONFIG.BATCH_SIZE);
      console.log(`Processing batch ${i / CONFIG.BATCH_SIZE + 1} of ${Math.ceil(chunks.length / CONFIG.BATCH_SIZE)}`);
      
      const batchResults = await Promise.all(
        batch.map(async (chunk, index) => {
          try {
            const embedding = await generateEmbedding(openai, chunk);
            return {
              content: chunk,
              embedding,
              metadata: {
                position: i + index,
                processingTime: Date.now(),
              }
            };
          } catch (error) {
            console.error(`Error processing chunk ${i + index}:`, error);
            throw error;
          }
        })
      );

      processedChunks.push(...batchResults);
      
      // Add delay between batches to prevent rate limiting
      if (i + CONFIG.BATCH_SIZE < chunks.length) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.INTER_CHUNK_DELAY));
      }
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Creating document record');
    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert({
        metadata: {
          filename: file.name,
          contentType: file.type,
          size: file.size,
          processor: 'edge-function',
          version: '1.0',
          chunkCount: processedChunks.length
        },
        processed: true
      })
      .select()
      .single();

    if (documentError) {
      console.error('Error creating document:', documentError);
      throw documentError;
    }

    console.log('Inserting document chunks');
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

    if (chunksError) {
      console.error('Error inserting chunks:', chunksError);
      throw chunksError;
    }

    if (agentId) {
      console.log('Creating agent-document association');
      const { error: assocError } = await supabase
        .from('ai_agent_documents')
        .insert({
          agent_id: agentId,
          document_id: documentData.id
        });

      if (assocError) {
        console.error('Error creating association:', assocError);
        throw assocError;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        documentId: documentData.id,
        chunksCount: processedChunks.length 
      }),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
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
  // Normalize text first
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  
  const chunks: string[] = [];
  const words = normalizedText.split(' ');
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    if (currentLength + word.length > size && currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
      const overlapWords = currentChunk.slice(-Math.floor(overlap / 10));
      currentChunk = [...overlapWords];
      currentLength = overlapWords.join(' ').length;
    }

    currentChunk.push(word);
    currentLength += word.length + 1; // +1 for space
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
}