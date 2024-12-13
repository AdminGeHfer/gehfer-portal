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

    // Get the last user message for similarity search
    const lastUserMessage = messages[messages.length - 1].content
    console.log('Processing query:', lastUserMessage)

    // Get agent configuration
    const { data: agent } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .single()

    console.log('Agent config:', agent)

    let relevantDocs = []
    if (agent?.use_knowledge_base) {
      console.log('Knowledge base enabled, searching for relevant documents...')
      
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

      // Search for similar documents using match_documents function
      const { data: documents, error: searchError } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: agent.search_threshold || 0.7,
        match_count: 5
      })

      if (searchError) {
        console.error('Error searching documents:', searchError)
      }

      console.log('Found relevant documents:', documents?.length || 0)
      
      if (documents && documents.length > 0) {
        relevantDocs = documents.map(doc => ({
          content: doc.content,
          similarity: doc.similarity
        }))
        console.log('Relevant docs:', relevantDocs)
      }
    }

    // Construct system message with context and memory
    const systemMessage = {
      role: 'system',
      content: `${agent?.system_prompt || 'You are a helpful assistant.'}\n\n${
        relevantDocs.length > 0 
          ? 'Here are some relevant documents that may help with the query:\n\n' + 
            relevantDocs.map(doc => `[Similarity: ${doc.similarity.toFixed(2)}]\n${doc.content}`).join('\n\n') +
            '\n\nPlease use this information to help answer the query. If the information is relevant, incorporate it into your response.'
          : ''
      }`
    }

    // Add memory context if available
    const memoryContext = memory?.history?.length > 0
      ? '\n\nConversation history:\n' + 
        memory.history.map(item => `${item.metadata.role}: ${item.content}`).join('\n')
      : ''

    if (memoryContext) {
      systemMessage.content += memoryContext
    }

    console.log('System message:', systemMessage)

    // Prepare messages array with context
    const contextualizedMessages = [
      systemMessage,
      ...messages
    ]

    // Get completion from OpenAI with agent parameters
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
    
    // Log completion for debugging
    console.log('Completion response:', completionData)

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