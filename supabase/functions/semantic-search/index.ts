import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
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

  const limitStatus = checkRateLimit(getRateLimitKey(req, user.id), 20, 60_000);
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
    const { query, limit = 5, threshold = 0.7 } = await req.json();
    const safeLimit = Math.min(20, Math.max(1, Number(limit)));
    const safeThreshold = Math.min(1, Math.max(0, Number(threshold)));

    if (typeof query !== "string" || query.trim().length < 2 || query.length > 4000) {
      return new Response(
        JSON.stringify({ error: "Invalid query payload" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    // Initialize OpenAI
    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    }));

    // Generate embedding for the query
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: query,
    });

    const embedding = embeddingResponse.data.data[0].embedding;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search for similar documents
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: safeThreshold,
      match_count: safeLimit
    });

    if (error) throw error;

    return new Response(JSON.stringify(documents), {
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in semantic-search function", error);
    return new Response(JSON.stringify({ error: "Semantic search failed" }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});
