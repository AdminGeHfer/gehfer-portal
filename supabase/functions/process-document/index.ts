import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ProcessingMetrics } from "./utils/metrics.ts";
import { validateContent } from "./utils/validation.ts";
import { ChunkingService } from "./services/chunking.ts";
import { EmbeddingsService } from "./services/embeddings.ts";
import { QueueService } from "./services/queue.ts";
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessDocumentPayload {
  content: string;
  metadata?: Record<string, any>;
  chunkSize?: number;
  chunkOverlap?: number;
}

serve(async (req) => {
  const metrics = new ProcessingMetrics();
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: ProcessDocumentPayload = await req.json();
    const { content, metadata = {}, chunkSize = 100, chunkOverlap = 20 } = payload;

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
    const chunks = chunkingService.createChunks(content, chunkSize, chunkOverlap);
    metrics.trackMetric('numberOfChunks', chunks.length);

    // Process chunks in batches
    const batchSize = 5;
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
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    metrics.trackMetric('processedChunks', results.length);

    // Store results in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabase
      .from('documents')
      .insert({
        content,
        metadata,
        embedding: results[0].embedding, // Store first embedding as document embedding
        processed: true,
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap
      })
      .select()
      .single();

    if (error) throw error;

    // Store chunks with embeddings
    const chunkInsertPromises = results.map(({ chunk, embedding }) =>
      supabase
        .from('document_chunks')
        .insert({
          document_id: data.id,
          content: chunk,
          embedding,
          metadata: metadata
        })
    );

    await Promise.all(chunkInsertPromises);

    metrics.trackMetric('totalExecutionTime', metrics.getExecutionTime());

    return new Response(
      JSON.stringify({ 
        success: true, 
        documentId: data.id,
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