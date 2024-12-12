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

    if (!file) {
      throw new Error('No file uploaded')
    }

    console.log('Processing document for module:', moduleId)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Load and split the document
    const loader = new PDFLoader(file)
    const docs = await loader.load()
    
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
    
    const chunks = await splitter.splitDocuments(docs)

    // Create embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    console.log(`Processing ${chunks.length} chunks`)

    // Process each chunk
    for (const chunk of chunks) {
      const embedding = await embeddings.embedQuery(chunk.pageContent)
      
      const { error } = await supabase
        .from('documents')
        .insert({
          content: chunk.pageContent,
          metadata: { 
            ...chunk.metadata,
            moduleId: moduleId || null
          },
          embedding,
          created_by: req.headers.get('x-user-id')
        })

      if (error) throw error
    }

    return new Response(
      JSON.stringify({ message: 'Document processed successfully' }),
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