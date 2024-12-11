import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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

    if (model === 'llama-70b') {
      const hfApiKey = Deno.env.get('HUGGING_FACE_API_KEY')
      if (!hfApiKey) {
        throw new Error('Hugging Face API key not configured')
      }

      console.log('Using Hugging Face model for chat completion')
      
      // Format messages into a conversation string
      const conversation = messages
        .map(m => `${m.role === 'assistant' ? 'Assistant' : 'Human'}: ${m.content}`)
        .join('\n') + '\nAssistant:'

      const response = await fetch(
        'https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hfApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: conversation,
            parameters: {
              max_new_tokens: 1000,
              temperature: 0.7,
              top_p: 0.9,
              do_sample: true,
              return_full_text: false,
            }
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        console.error('Hugging Face API error:', error)
        throw new Error(`Hugging Face API error: ${JSON.stringify(error)}`)
      }

      const data = await response.json()
      console.log('Hugging Face response:', data)

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid response format from Hugging Face')
      }

      const generatedText = data[0].generated_text.trim()

      return new Response(
        JSON.stringify({
          choices: [{
            message: {
              role: 'assistant',
              content: generatedText,
            }
          }]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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