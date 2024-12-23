import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { DoclingProcessor } from "./services/doclingProcessor.ts";
import { ProcessingMetrics } from "./utils/metrics.ts";

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
    const { documentId, filePath } = await req.json();
    console.log('Processing document:', { documentId, filePath });

    if (!documentId || !filePath) {
      throw new Error('Missing required fields: documentId or filePath');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize Docling processor
    const processor = new DoclingProcessor(metrics);
    const results = await processor.processDocument(documentId, filePath, supabase);

    console.log('Document processed successfully:', results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        metrics: metrics.getAllMetrics()
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