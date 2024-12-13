import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.6";
import { CONFIG, CORS_HEADERS } from "./config.ts";
import { EmbeddingsService } from "./services/embeddings.ts";
import { QueueService } from "./services/queue.ts";
import { validateContent } from "./utils/validation.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const { documentId, filePath } = await req.json();
    
    if (!documentId || !filePath) {
      throw new Error('Missing required fields: documentId or filePath');
    }

    // Fetch document content from storage
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('documents')
      .download(filePath);

    if (fileError) throw fileError;

    const content = await fileData.text();
    const validation = validateContent(content);
    
    if (!validation.isValid) {
      throw new Error(`Invalid content: ${validation.error}`);
    }

    // Initialize services
    const embeddingsService = new EmbeddingsService();
    const queueService = new QueueService();

    // Process document in chunks
    const chunks = content.match(/.{1,1000}/g) || [];
    
    console.log(`Processing ${chunks.length} chunks for document ${documentId}`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      await queueService.add({
        operation: async () => {
          const embedding = await embeddingsService.generateEmbedding(chunk);
          
          const { error: insertError } = await supabase
            .from('document_chunks')
            .insert({
              document_id: documentId,
              content: chunk,
              embedding,
              metadata: { chunkIndex: i }
            });

          if (insertError) throw insertError;
          
          console.log(`Successfully processed chunk ${i + 1}/${chunks.length}`);
        },
        onError: async (error: Error) => {
          console.error(`Error processing chunk ${i}:`, error);
          throw error;
        }
      });
    }

    // Update document status
    const { error: updateError } = await supabase
      .from('documents')
      .update({ processed: true })
      .eq('id', documentId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Document processed successfully',
        metrics: {
          chunks: chunks.length,
          executionTime: Date.now(),
        }
      }),
      { 
        headers: { 
          ...CORS_HEADERS,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error in process-document function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        metrics: {
          executionTime: Date.now(),
          memoryStats: null
        }
      }),
      { 
        headers: { 
          ...CORS_HEADERS,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
});