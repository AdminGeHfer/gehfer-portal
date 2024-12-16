import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content, chunkSize, overlap } = await req.json()

    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    }))

    // Dividir em parágrafos primeiro
    const paragraphs = content.split(/\n\n+/)
    const chunks: any[] = []
    let currentChunk = ''
    let currentSize = 0

    for (const paragraph of paragraphs) {
      if (currentSize + paragraph.length > chunkSize && currentChunk) {
        // Analisar o chunk atual
        const analysis = await analyzeChunk(openai, currentChunk)
        chunks.push(analysis)
        
        // Manter sobreposição
        const words = currentChunk.split(' ')
        currentChunk = words.slice(-Math.floor(overlap / 10)).join(' ') + ' ' + paragraph
        currentSize = currentChunk.length
      } else {
        currentChunk += (currentChunk ? ' ' : '') + paragraph
        currentSize += paragraph.length
      }
    }

    // Processar último chunk
    if (currentChunk) {
      const analysis = await analyzeChunk(openai, currentChunk)
      chunks.push(analysis)
    }

    return new Response(
      JSON.stringify(chunks),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function analyzeChunk(openai: OpenAIApi, text: string) {
  const response = await openai.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Analyze the following text and provide: 1) Main topic 2) Semantic context 3) A coherence score (0-1)"
      },
      {
        role: "user",
        content: text
      }
    ]
  })

  const analysis = response.data.choices[0].message?.content
  const parsed = JSON.parse(analysis || '{}')

  return {
    content: text,
    topic: parsed.topic,
    context: parsed.context,
    coherence_score: parsed.coherence_score,
    metadata: {
      analysis_timestamp: new Date().toISOString()
    }
  }
}