import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0"
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import { checkRateLimit, getRateLimitKey } from "../_shared/rateLimit.ts";

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }

  const user = await requireAuthenticatedUser(req);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }

  const limitStatus = checkRateLimit(getRateLimitKey(req, user.id), 10, 60_000);
  if (!limitStatus.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests" }),
      {
        status: 429,
        headers: {
          ...getCorsHeaders(req),
          "Content-Type": "application/json",
          "Retry-After": String(limitStatus.retryAfterSec),
        },
      },
    );
  }

  try {
    const { content, chunkSize, overlap } = await req.json()
    const safeChunkSize = Math.min(3000, Math.max(250, Number(chunkSize ?? 1000)));
    const safeOverlap = Math.min(500, Math.max(0, Number(overlap ?? 100)));

    if (typeof content !== "string" || content.trim().length < 10 || content.length > 100_000) {
      return new Response(
        JSON.stringify({ error: "Invalid content payload" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    }))

    // Dividir em parágrafos primeiro
    const paragraphs = content.split(/\n\n+/)
    const chunks: any[] = []
    let currentChunk = ''
    let currentSize = 0

    for (const paragraph of paragraphs) {
      if (currentSize + paragraph.length > safeChunkSize && currentChunk) {
        // Analisar o chunk atual
        const analysis = await analyzeChunk(openai, currentChunk)
        chunks.push(analysis)
        
        // Manter sobreposição
        const words = currentChunk.split(' ')
        currentChunk = words.slice(-Math.floor(safeOverlap / 10)).join(' ') + ' ' + paragraph
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
      { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error processing semantic chunks")
    return new Response(
      JSON.stringify({ error: "Failed to process semantic chunks" }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
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
