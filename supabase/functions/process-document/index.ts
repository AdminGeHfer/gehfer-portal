import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.6";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";
import { ProcessingMetrics } from "./utils/metrics.ts";
import { validateContent } from "./utils/validation.ts";
import { ChunkingService } from "./services/chunking.ts";
import { EmbeddingsService } from "./services/embeddings.ts";
import { QueueService } from "./services/queue.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const metrics = new ProcessingMetrics();
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse FormData
    const formData = await req.formData();
    const documentId = formData.get('documentId');
    const filePath = formData.get('filePath');

    if (!documentId || !filePath) {
      throw new Error('Missing required fields: documentId or filePath');
    }

    console.log('Processing document:', { documentId, filePath });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(filePath);

    if (downloadError) {
      throw new Error(`Error downloading file: ${downloadError.message}`);
    }

    // Convert file to text
    const content = await fileData.text();
    
    // Log metrics
    metrics.trackMetric('contentLength', content.length);
    metrics.trackMemory();

    // Validate content
    const validation = validateContent(content);
    if (!validation.isValid) {
      throw new Error(`Invalid content: ${validation.error}`);
    }

    // Initialize services
    const chunkingService = new ChunkingService();
    const embeddingsService = new EmbeddingsService();
    const queueService = new QueueService();

    // Process in chunks with queue
    const chunks = chunkingService.createChunks(content, 250, 50);
    metrics.trackMetric('numberOfChunks', chunks.length);

    // Process chunks in batches
    const batchSize = 2;
    const results = [];
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchPromises = batch.map(async (chunk) => {
        try {
          const embedding = await queueService.enqueue(
            () => embeddingsService.generateEmbedding(chunk)
          );
          return { chunk, embedding };
        } catch (error) {
          console.error(`Error processing chunk ${i}:`, error);
          throw error;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Force garbage collection and pause between batches
      if (i + batchSize < chunks.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    metrics.trackMetric('processedChunks', results.length);

    // Update document with processed content
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        content,
        embedding: results[0].embedding,
        processed: true,
        chunk_size: 250,
        chunk_overlap: 50
      })
      .eq('id', documentId);

    if (updateError) throw updateError;

    // Store chunks with embeddings
    const chunkInsertPromises = results.map(({ chunk, embedding }) =>
      supabase
        .from('document_chunks')
        .insert({
          document_id: documentId,
          content: chunk,
          embedding,
          metadata: {}
        })
    );

    await Promise.all(chunkInsertPromises);

    metrics.trackMetric('totalExecutionTime', metrics.getExecutionTime());

    return new Response(
      JSON.stringify({ 
        success: true, 
        documentId,
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
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        metrics: metrics.getAllMetrics()
      }),
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