import { supabase } from "@/integrations/supabase/client";

interface ChunkMetadata {
  position: number;
  topic: string;
  coherence_score: number;
  semantic_context: string;
}

export const processDocumentWithSemanticChunking = async (
  documentId: string,
  content: string,
  chunkSize: number = 1000,
  overlap: number = 200
) => {
  try {
    // Criar nova versão do documento
    const { data: versionData, error: versionError } = await supabase
      .from('document_versions')
      .insert({
        document_id: documentId,
        version_number: 1, // Será incrementado via trigger
        metadata: {
          chunk_size: chunkSize,
          overlap,
          processing_date: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (versionError) throw versionError;

    // Processar chunks semanticamente via Edge Function
    const { data: processedChunks, error: processingError } = await supabase.functions
      .invoke('process-semantic-chunks', {
        body: { content, chunkSize, overlap }
      });

    if (processingError) throw processingError;

    // Inserir chunks processados
    const { error: insertError } = await supabase
      .from('document_chunks')
      .insert(
        processedChunks.map((chunk: any, index: number) => ({
          document_id: documentId,
          version_id: versionData.id,
          content: chunk.content,
          semantic_context: chunk.context,
          topic: chunk.topic,
          coherence_score: chunk.coherence_score,
          metadata: {
            position: index,
            ...chunk.metadata
          }
        }))
      );

    if (insertError) throw insertError;

    return { success: true, versionId: versionData.id };
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
};