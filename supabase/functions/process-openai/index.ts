import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.20.1/mod.ts";
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

  const limit = checkRateLimit(getRateLimitKey(req, user.id), 40, 60_000);
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
    const openAiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const openai = new OpenAI({
      apiKey: openAiApiKey,
    });

    const { action, content } = await req.json();
    if (!["test", "embedding"].includes(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
      );
    }

    if (action === "embedding") {
      if (typeof content !== "string" || content.trim().length < 1 || content.length > 12_000) {
        return new Response(
          JSON.stringify({ error: "Invalid content payload" }),
          { status: 400, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
        );
      }
    }

    switch (action) {
      case 'test':
        await openai.embeddings.create({
          input: "test",
          model: "text-embedding-3-small"
        });
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });

      case 'embedding':
        const embedding = await openai.embeddings.create({
          input: content,
          model: "text-embedding-3-small"
        });
        return new Response(JSON.stringify({ embedding: embedding.data[0].embedding }), {
          headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error("Error in process-openai function", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});
