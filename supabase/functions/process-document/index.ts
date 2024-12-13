import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ProcessingMetrics } from "./utils/metrics.ts";
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

  const metrics = new ProcessingMetrics();
  console.log('Starting document processing request');

  try {
    // Parse the JSON body
    const body = await req.json();
    console.log('Received request body:', body);

    if (!body.documentId || !body.filePath) {
      throw new Error('Missing required fields: documentId or filePath');
    }

    const queueService = new QueueService(metrics);
    const results = await queueService.executeWithRetry(body.documentId, body.filePath);

    metrics.trackMemory();
    const finalMetrics = metrics.getAllMetrics();
    console.log('Processing completed successfully', finalMetrics);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        metrics: finalMetrics
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in document processing:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        metrics: metrics.getAllMetrics()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});