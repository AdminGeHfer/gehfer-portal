import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import OpenAI from "https://esm.sh/openai@4.24.1"
import { CONFIG } from "./config.ts"
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import { checkRateLimit, getRateLimitKey } from "../_shared/rateLimit.ts";

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "application/json",
  "application/pdf",
]);

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

  const limit = checkRateLimit(getRateLimitKey(req, user.id), 8, 60_000);
  if (!limit.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests" }),
      {
        status: 429,
        headers: {
          ...getCorsHeaders(req),
          "Content-Type": "application/json",
          "Retry-After": String(limit.retryAfterSec),
        },
      },
    );
  }

  try {
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const formData = await req.formData();
    const file = formData.get('file');
    const agentId = formData.get('agentId');

    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: "Invalid file payload" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: "Invalid file size" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return new Response(
        JSON.stringify({ error: "File type not allowed" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    if (agentId && (typeof agentId !== "string" || !/^[0-9a-f-]{36}$/i.test(agentId))) {
      return new Response(
        JSON.stringify({ error: "Invalid agent ID" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    const content = await file.text();
    if (content.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "File content too short" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    // Process in smaller chunks to manage memory better
    const chunks = splitIntoChunks(content, CONFIG.CHUNK_SIZE, CONFIG.CHUNK_OVERLAP);

    const processedChunks = [];

    // Process chunks in batches to avoid memory issues
    for (let i = 0; i < chunks.length; i += CONFIG.BATCH_SIZE) {
      const batch = chunks.slice(i, i + CONFIG.BATCH_SIZE);

      const batchResults = await Promise.all(
        batch.map(async (chunk, index) => {
          try {
            const embedding = await generateEmbedding(openai, chunk);
            return {
              content: chunk,
              embedding,
              metadata: {
                position: i + index,
                processingTime: Date.now(),
              }
            };
          } catch (error) {
            console.error(`Error processing chunk ${i + index}`);
            throw error;
          }
        })
      );

      processedChunks.push(...batchResults);
      
      // Add delay between batches to prevent rate limiting
      if (i + CONFIG.BATCH_SIZE < chunks.length) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.INTER_CHUNK_DELAY));
      }
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert({
        created_by: user.id,
        metadata: {
          filename: file.name,
          contentType: file.type,
          size: file.size,
          processor: 'edge-function',
          version: '1.0',
          chunkCount: processedChunks.length
        },
        processed: true
      })
      .select()
      .single();

    if (documentError) {
      console.error('Error creating document');
      throw documentError;
    }

    const { error: chunksError } = await supabase
      .from('document_chunks')
      .insert(
        processedChunks.map(chunk => ({
          document_id: documentData.id,
          content: chunk.content,
          embedding: chunk.embedding,
          metadata: chunk.metadata
        }))
      );

    if (chunksError) {
      console.error('Error inserting chunks');
      throw chunksError;
    }

    if (agentId) {
      console.log('Creating agent-document association');
      const { error: assocError } = await supabase
        .from('ai_agent_documents')
        .insert({
          agent_id: agentId as string,
          document_id: documentData.id
        });

      if (assocError) {
        console.error('Error creating association');
        throw assocError;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        documentId: documentData.id,
        chunksCount: processedChunks.length 
      }),
      { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing document');
    return new Response(
      JSON.stringify({ error: "Document processing failed" }),
      { 
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }
      }
    );
  }
});

async function generateEmbedding(openai: OpenAI, text: string) {
  const response = await openai.embeddings.create({
    input: text,
    model: 'text-embedding-3-small'
  });
  return response.data[0].embedding;
}

function splitIntoChunks(text: string, size: number, overlap: number): string[] {
  // Normalize text first
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  
  const chunks: string[] = [];
  const words = normalizedText.split(' ');
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const word of words) {
    if (currentLength + word.length > size && currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
      const overlapWords = currentChunk.slice(-Math.floor(overlap / 10));
      currentChunk = [...overlapWords];
      currentLength = overlapWords.join(' ').length;
    }

    currentChunk.push(word);
    currentLength += word.length + 1; // +1 for space
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
}
