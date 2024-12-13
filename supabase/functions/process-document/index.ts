import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { EmbeddingsService } from "./services/embeddings.ts";
import { QueueService } from "./services/queue.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { text } = await req.json();
    if (!text) {
      throw new Error('Text is required');
    }

    const embeddingsService = new EmbeddingsService(apiKey);
    const queueService = new QueueService();

    const embedding = await queueService.executeWithRetry(() => 
      embeddingsService.generateEmbedding(text)
    );

    return new Response(
      JSON.stringify({ embedding }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in process-document function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});