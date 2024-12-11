import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
const groqApiKey = Deno.env.get('GROQ_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages, model = 'gpt-4o-mini' } = await req.json()
    console.log('Processing chat completion request:', { messageCount: messages.length, model })

    if (model.startsWith('groq-')) {
      if (!groqApiKey) {
        throw new Error('Groq API key not configured')
      }

      console.log('Using Groq model for chat completion')
      
      // Limit conversation history for Groq to stay within rate limits
      const MAX_MESSAGES = 10
      const truncatedMessages = messages.slice(-MAX_MESSAGES)
      
      const groqModel = model === 'groq-mixtral' ? 'mixtral-8x7b-32768' : 'llama2-70b-4096'
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: groqModel,
          messages: [
            { 
              role: 'system', 
              content: 'Você é um assistente da GeHfer, seu objetivo é ajudar todos os colaboradores a ser mais eficientes e resolver seus problemas. Seja sempre prestativo e profissional.' 
            },
            ...truncatedMessages
          ],
          temperature: 0.7,
          max_tokens: 1000, // Limit response size
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Groq API error:', error)
        
        // Handle rate limit error specifically
        if (error.error?.code === 'rate_limit_exceeded') {
          throw new Error('Limite de tokens excedido. Por favor, aguarde um momento antes de tentar novamente ou use um modelo diferente.')
        }
        
        throw new Error(`Groq API error: ${JSON.stringify(error)}`)
      }

      const data = await response.json()
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else {
      if (!openAIApiKey) {
        throw new Error('OpenAI API key not configured')
      }

      console.log('Using OpenAI model for chat completion')
      
      // Limit conversation history for OpenAI to stay within context limits
      const MAX_MESSAGES = 8 // More conservative limit for OpenAI
      const truncatedMessages = messages.slice(-MAX_MESSAGES)
      
      const openAIModel = model === 'gpt-4o-mini' ? 'gpt-3.5-turbo' : 'gpt-4'
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: openAIModel,
          messages: [
            { 
              role: 'system', 
              content: 'Você é um assistente da GeHfer, seu objetivo é ajudar todos os colaboradores a ser mais eficientes e resolver seus problemas. Seja sempre prestativo e profissional.' 
            },
            ...truncatedMessages
          ],
          temperature: 0.7,
          max_tokens: 1000, // Limit response size
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('OpenAI API error:', error)
        
        // Handle context length error specifically
        if (error.error?.code === 'context_length_exceeded') {
          throw new Error('A conversa ficou muito longa. Por favor, crie uma nova conversa ou use um modelo diferente.')
        }
        
        throw new Error(`OpenAI API error: ${JSON.stringify(error)}`)
      }

      const data = await response.json()
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.error('Error in chat-completion function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})