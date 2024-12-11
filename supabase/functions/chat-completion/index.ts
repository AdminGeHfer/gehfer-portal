import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
            ...messages
          ],
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Groq API error:', error)
        throw new Error(`Groq API error: ${JSON.stringify(error)}`)
      }

      const data = await response.json()
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else {
      const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
      if (!openAIApiKey) {
        throw new Error('OpenAI API key not configured')
      }

      console.log('Using OpenAI model for chat completion')

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { 
              role: 'system', 
              content: 'Você é um assistente da GeHfer, seu objetivo é ajudar todos os colaboradores a ser mais eficientes e resolver seus problemas. Seja sempre prestativo e profissional.' 
            },
            ...messages
          ],
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('OpenAI API error:', error)
        throw new Error(`OpenAI API error: ${JSON.stringify(error)}`)
      }

      const data = await response.json()
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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