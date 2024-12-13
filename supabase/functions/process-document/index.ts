import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CHUNK_SIZE = 500; // Reduced from 1000
const CHUNK_OVERLAP = 100; // Reduced from 200
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const BATCH_SIZE = 2; // Reduced from 3
const INTER_CHUNK_DELAY = 500; // Added delay between chunks

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting document processing...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    }))

    // Get the form data
    const formData = await req.formData()
    const documentId = formData.get('documentId')?.toString()
    const filePath = formData.get('filePath')?.toString()

    if (!documentId || !filePath) {
      throw new Error('Missing required parameters')
    }

    console.log('Processing document:', documentId, 'at path:', filePath)

    // Download file from storage with retries
    let fileData;
    let downloadError;
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const response = await supabaseClient.storage
          .from('documents')
          .download(filePath);
        
        if (response.error) throw response.error;
        fileData = response.data;
        break;
      } catch (error) {
        downloadError = error;
        if (i < MAX_RETRIES - 1) {
          console.log(`Download retry ${i + 1} failed, waiting ${RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    if (!fileData) {
      throw downloadError || new Error('Failed to download file after retries');
    }

    // Convert file to text
    const content = await fileData.text()
    console.log('Document content length:', content.length);
    
    // Update document with basic info first
    const { error: updateError } = await supabaseClient
      .from('documents')
      .update({ 
        content,
        chunk_size: CHUNK_SIZE,
        chunk_overlap: CHUNK_OVERLAP
      })
      .eq('id', documentId)

    if (updateError) throw updateError

    // Split content into chunks
    const chunks = splitIntoChunks(content, CHUNK_SIZE, CHUNK_OVERLAP)
    console.log(`Created ${chunks.length} chunks`)

    // Process chunks in smaller batches with memory cleanup
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batchChunks = chunks.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1} of ${Math.ceil(chunks.length/BATCH_SIZE)}`);
      
      // Add delay between batches
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }

      // Process each chunk sequentially
      for (const chunk of batchChunks) {
        try {
          console.log(`Processing chunk of length: ${chunk.length}`);
          
          // Generate embedding with retries
          let embedding = null;
          for (let j = 0; j < MAX_RETRIES; j++) {
            try {
              const response = await openai.createEmbedding({
                model: "text-embedding-ada-002",
                input: chunk,
              });
              
              if (!response.data?.data?.[0]?.embedding) {
                throw new Error('Failed to generate embedding');
              }
              
              embedding = response.data.data[0].embedding;
              break;
            } catch (error) {
              console.error(`Embedding generation error (attempt ${j + 1}):`, error);
              if (j < MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
              } else {
                throw error;
              }
            }
          }

          if (!embedding) {
            throw new Error('Failed to generate embedding after all retries');
          }

          // Store chunk with embedding
          const { error: chunkError } = await supabaseClient
            .from('document_chunks')
            .insert({
              document_id: documentId,
              content: chunk,
              embedding: embedding,
              metadata: {
                chunk_size: CHUNK_SIZE,
                chunk_overlap: CHUNK_OVERLAP
              }
            })

          if (chunkError) {
            console.error('Error storing chunk:', chunkError);
            throw chunkError;
          }

          // Add small delay between chunks and clear some memory
          await new Promise(resolve => setTimeout(resolve, INTER_CHUNK_DELAY));
          embedding = null; // Help garbage collection
          
        } catch (error) {
          console.error('Error processing chunk:', error);
          throw error;
        }
      }
    }

    // Mark document as processed
    const { error: finalizeError } = await supabaseClient
      .from('documents')
      .update({ processed: true })
      .eq('id', documentId)

    if (finalizeError) throw finalizeError

    console.log('Document processing completed successfully');

    return new Response(
      JSON.stringify({ success: true, chunks: chunks.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing document:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function splitIntoChunks(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = []
  let startIndex = 0

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length)
    chunks.push(text.slice(startIndex, endIndex))
    startIndex = endIndex - overlap
  }

  return chunks
}