import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ProcessingMetrics } from "./utils/metrics.ts";
import { QueueService } from "./services/queue.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const metrics = new ProcessingMetrics();
  console.log('Starting document processing request');

  try {
    const body = await req.json();
    console.log('Received request body:', body);

    if (!body.documentId || !body.filePath) {
      throw new Error('Missing required fields: documentId or filePath');
    }

    const queueService = new QueueService(metrics);
    const results = await queueService.executeWithRetry(body.documentId, body.filePath);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update document status after successful processing
    const { error: updateError } = await supabase
      .from('documents')
      .update({ 
        processed: true,
        embedding: results.embedding,
        content: results.content
      })
      .eq('id', body.documentId);

    if (updateError) {
      console.error('Error updating document status:', updateError);
      throw updateError;
    }

    console.log(`Document ${body.documentId} marked as processed`);

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