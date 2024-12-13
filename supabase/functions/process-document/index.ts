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
    const { content, chunkSize = 1000, overlap = 200 } = await req.json();
    
    if (!content) {
      throw new Error('No content provided');
    }

    const queueService = new QueueService(metrics);
    const results = await queueService.executeWithRetry(content, chunkSize, overlap);

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