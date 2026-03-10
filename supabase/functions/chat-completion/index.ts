import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.24.1"
import { getCorsHeaders, handleCors } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import { checkRateLimit, getRateLimitKey } from "../_shared/rateLimit.ts";

const ALLOWED_MODELS = new Set(["gpt-4", "gpt-4o", "gpt-4o-mini"]);

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

  const limit = checkRateLimit(getRateLimitKey(req, user.id), 30, 60_000);
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
    const { 
      messages, 
      model, 
      systemPrompt, 
      useKnowledgeBase, 
      temperature = 0.7,
      maxTokens = 1000,
      topP = 1,
      searchThreshold = 0.4,
      agentId 
    } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
      return new Response(
        JSON.stringify({ error: "Invalid messages payload" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    const safeMessages = messages.filter((message) =>
      message &&
      typeof message.role === "string" &&
      typeof message.content === "string" &&
      message.content.length <= 8000
    );

    if (safeMessages.length !== messages.length) {
      return new Response(
        JSON.stringify({ error: "Invalid message format" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    if (typeof model !== "string" || !ALLOWED_MODELS.has(model)) {
      return new Response(
        JSON.stringify({ error: "Invalid model" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    const safeMaxTokens = Math.min(4096, Math.max(100, Number(maxTokens || 1000)));
    const safeTemperature = Math.min(1.2, Math.max(0, Number(temperature || 0.7)));
    const safeTopP = Math.min(1, Math.max(0, Number(topP || 1)));
    const safeThreshold = Math.min(1, Math.max(0, Number(searchThreshold || 0.4)));

    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const openai = new OpenAI({ apiKey: openAiApiKey });
    let contextualMessages = [...safeMessages];

    if (useKnowledgeBase && agentId) {
      try {
        const lastUserMessage = safeMessages[safeMessages.length - 1].content;
        
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: lastUserMessage,
        });

        if (!embeddingResponse.data?.[0]?.embedding) {
          throw new Error('Failed to generate embedding');
        }

        const embedding = embeddingResponse.data[0].embedding;

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabase configuration missing');
        }

        const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.7.1");
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: documents, error: searchError } = await supabase.rpc(
          'match_documents',
          {
            query_embedding: embedding,
            match_threshold: safeThreshold,
            match_count: 5,
            p_agent_id: agentId
          }
        );

        if (searchError) {
          console.error("Error searching documents");
          throw searchError;
        }

        if (documents && documents.length > 0) {
          const context = documents
            .map(doc => doc.content)
            .join('\n\n');

          contextualMessages.unshift({
            role: 'system',
            content: `Context from knowledge base:\n${context}\n\n${systemPrompt || ''}`
          });
        } else {
          console.log('No relevant documents found');
          if (systemPrompt) {
            contextualMessages.unshift({
              role: 'system',
              content: systemPrompt
            });
          }
        }
      } catch (error) {
        console.error("Error in document search");
        if (systemPrompt) {
          contextualMessages.unshift({
            role: 'system',
            content: systemPrompt
          });
        }
      }
    } else if (systemPrompt) {
      contextualMessages.unshift({
        role: 'system',
        content: systemPrompt
      });
    }

    const completion = await openai.chat.completions.create({
      model: model === 'gpt-4o' ? 'gpt-4' : model,
      messages: contextualMessages,
      temperature: safeTemperature,
      max_tokens: safeMaxTokens,
      top_p: safeTopP,
    });

    if (!completion.choices?.[0]?.message) {
      throw new Error('Invalid response from OpenAI');
    }

    return new Response(
      JSON.stringify(completion),
      { headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } },
    );

  } catch (error) {
    console.error("Error in chat completion", error);
    return new Response(
      JSON.stringify({ error: "Chat completion failed" }),
      { 
        status: 500,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' }
      },
    );
  }
});
