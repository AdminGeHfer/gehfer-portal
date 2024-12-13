import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages, model, agentId, memory } = await req.json()
    const openAiKey = Deno.env.get('OPENAI_API_KEY')
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1].content

    // Get agent configuration
    const { data: agent } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .single()

    console.log('Agent config:', agent)

    // Search for relevant documents if knowledge base is enabled
    let relevantDocs = []
    if (agent?.use_knowledge_base) {
      console.log('Searching for relevant documents...')
      
      // Generate embedding for the query
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: lastUserMessage,
          model: "text-embedding-ada-002"
        })
      })

      const embeddingData = await embeddingResponse.json()
      const queryEmbedding = embeddingData.data[0].embedding

      // Search for similar documents
      const { data: documents } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: agent.search_threshold,
        match_count: 5
      })

      console.log('Found relevant documents:', documents)
      
      if (documents && documents.length > 0) {
        relevantDocs = documents.map(doc => doc.content)
      }
    }

    // Construct system message with context
    const systemMessage = {
      role: 'system',
      content: `${agent?.system_prompt || 'You are a helpful assistant.'}\n\n${
        relevantDocs.length > 0 
          ? 'Here are some relevant documents that may help with the query:\n\n' + 
            relevantDocs.join('\n\n') + 
            '\n\nPlease use this information to help answer the query.'
          : ''
      }`
    }

    // Prepare messages array with context
    const contextualizedMessages = [
      systemMessage,
      ...messages
    ]

    console.log('Sending request to OpenAI with messages:', contextualizedMessages)

    // Get completion from OpenAI
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: contextualizedMessages,
        temperature: agent?.temperature || 0.7,
        max_tokens: agent?.max_tokens || 1000,
        top_p: agent?.top_p || 0.9,
      })
    })

    const completionData = await completion.json()
    
    return new Response(JSON.stringify(completionData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})