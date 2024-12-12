import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // Get the form data
    const formData = await req.formData()
    const file = formData.get('file')
    const moduleId = formData.get('moduleId')?.toString()

    if (!file || !(file instanceof File)) {
      throw new Error('No file provided')
    }

    console.log('Processing file:', file.name, 'size:', file.size)

    // Read the file content as text
    const content = await file.text()

    // Store the document in the documents table
    const { data: document, error: documentError } = await supabaseClient
      .from('documents')
      .insert({
        content,
        metadata: {
          filename: file.name,
          size: file.size,
          type: file.type,
          moduleId: moduleId || null
        }
      })
      .select()
      .single()

    if (documentError) {
      console.error('Error storing document:', documentError)
      throw documentError
    }

    console.log('Document stored successfully:', document.id)

    // Return a simple success response without any special characters
    return new Response(
      JSON.stringify({ 
        success: true, 
        documentId: document.id 
      }, null, 2),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing document:', error)
    // Return a simple error response without any special characters
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }, null, 2),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400,
      }
    )
  }
})