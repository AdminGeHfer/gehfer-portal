import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
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

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('documents')
      .download(filePath)

    if (downloadError) {
      throw downloadError
    }

    // Convert file to text
    const content = await fileData.text()

    // Update document with content
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

    // Process each chunk
    for (const chunk of chunks) {
      // Generate embedding
      const { data: embedding } = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: chunk,
      })

      if (!embedding?.data?.[0]?.embedding) {
        throw new Error('Failed to generate embedding')
      }

      // Store chunk with embedding
      const { error: chunkError } = await supabaseClient
        .from('document_chunks')
        .insert({
          document_id: documentId,
          content: chunk,
          embedding: embedding.data[0].embedding,
          metadata: {
            chunk_size: CHUNK_SIZE,
            chunk_overlap: CHUNK_OVERLAP
          }
        })

      if (chunkError) throw chunkError
    }

    // Mark document as processed
    const { error: finalizeError } = await supabaseClient
      .from('documents')
      .update({ 
        processed: true
      })
      .eq('id', documentId)

    if (finalizeError) throw finalizeError

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