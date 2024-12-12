import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { OpenAIEmbeddings } from 'https://esm.sh/@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'https://esm.sh/langchain/text_splitter'
import { PDFLoader } from 'https://esm.sh/@langchain/community/document_loaders/fs/pdf'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const moduleId = formData.get('moduleId')
    const config = formData.get('config')
    const parsedConfig = config ? JSON.parse(config as string) : null

    if (!file) {
      throw new Error('No file uploaded')
    }

    console.log('Processing document for module:', moduleId, 'with config:', parsedConfig)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Load and split the document with configurable chunk size
    const loader = new PDFLoader(file)
    const docs = await loader.load()
    
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: parsedConfig?.chunkSize || 1000,
      chunkOverlap: parsedConfig?.chunkOverlap || 200,
    })
    
    const chunks = await splitter.splitDocuments(docs)

    // Create embeddings using configured model
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    console.log(`Processing ${chunks.length} chunks with size ${parsedConfig?.chunkSize || 1000}`)

    // Process each chunk
    for (const chunk of chunks) {
      const embedding = await embeddings.embedQuery(chunk.pageContent)
      
      const { error } = await supabase
        .from('documents')
        .insert({
          content: chunk.pageContent,
          metadata: { 
            ...chunk.metadata,
            moduleId: moduleId || null,
            config: parsedConfig
          },
          embedding,
          created_by: req.headers.get('x-user-id')
        })

      if (error) throw error
    }

    return new Response(
      JSON.stringify({ 
        message: 'Document processed successfully',
        chunks: chunks.length,
        config: parsedConfig
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})