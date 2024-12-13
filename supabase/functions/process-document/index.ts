import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { CONFIG, CORS_HEADERS } from "./config.ts";
import { validateContent } from "./utils/validation.ts";
import { ProcessingMetrics } from "./utils/metrics.ts";
import { EmbeddingsService } from "./services/embeddings.ts";
import { splitIntoChunks } from "./services/chunking.ts";

serve(async (req) => {
  const metrics = new ProcessingMetrics();
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    console.log('Starting document processing...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const documentId = formData.get('documentId')?.toString();
    const filePath = formData.get('filePath')?.toString();

    if (!documentId || !filePath) {
      throw new Error('Missing required parameters');
    }

    console.log('Processing document:', documentId, 'at path:', filePath);
    metrics.trackMetric('documentId', documentId);

    // Download file
    const response = await supabaseClient.storage
      .from('documents')
      .download(filePath);
    
    if (response.error) throw response.error;
    
    const content = await response.data.text();
    console.log('Document content length:', content.length);
    metrics.trackMetric('contentLength', content.length);

    // Validate content
    const validation = validateContent(content);
    if (!validation.isValid) {
      throw new Error(`Content validation failed: ${validation.error}`);
    }

    // Update document with basic info
    await supabaseClient
      .from('documents')
      .update({ 
        content,
        chunk_size: CONFIG.CHUNK_SIZE,
        chunk_overlap: CONFIG.CHUNK_OVERLAP
      })
      .eq('id', documentId);

    // Process chunks
    const chunks = splitIntoChunks(content);
    console.log(`Created ${chunks.length} chunks`);
    metrics.trackMetric('chunksCount', chunks.length);

    const embeddingsService = new EmbeddingsService();

    // Process chunks in batches
    for (let i = 0; i < chunks.length; i += CONFIG.BATCH_SIZE) {
      metrics.trackMemory();
      
      const batchChunks = chunks.slice(i, i + CONFIG.BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i/CONFIG.BATCH_SIZE) + 1} of ${Math.ceil(chunks.length/CONFIG.BATCH_SIZE)}`);
      
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.INTER_CHUNK_DELAY));
      }

      for (const chunk of batchChunks) {
        const embedding = await embeddingsService.generateEmbedding(chunk);

        await supabaseClient
          .from('document_chunks')
          .insert({
            document_id: documentId,
            content: chunk,
            embedding: embedding,
            metadata: {
              chunk_size: CONFIG.CHUNK_SIZE,
              chunk_overlap: CONFIG.CHUNK_OVERLAP
            }
          });

        await new Promise(resolve => setTimeout(resolve, CONFIG.INTER_CHUNK_DELAY));
      }
    }

    // Mark document as processed
    await supabaseClient
      .from('documents')
      .update({ processed: true })
      .eq('id', documentId);

    const finalMetrics = metrics.getAllMetrics();
    console.log('Processing completed. Metrics:', finalMetrics);

    return new Response(
      JSON.stringify({ success: true, metrics: finalMetrics }),
      {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing document:', error);
    metrics.trackMetric('error', error.message);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        metrics: metrics.getAllMetrics()
      }),
      {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});