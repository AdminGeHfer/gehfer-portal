import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentMetadata, DocumentResponse } from "@/types/documents/metadata";

export const useDocumentOperations = (agentId: string) => {
  const [isLoading, setIsLoading] = useState(true);

  const isValidMetadata = (metadata: unknown): metadata is DocumentMetadata => {
    if (!metadata || typeof metadata !== 'object') return false;
    const m = metadata as Record<string, unknown>;
    return typeof m.filename === 'string' && 
           typeof m.contentType === 'string' && 
           typeof m.size === 'number';
  };

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_agent_documents')
        .select(`
          document_id,
          documents (
            id,
            metadata,
            created_at
          )
        `)
        .eq('agent_id', agentId);

      if (error) throw error;

      if (data) {
        return data
          .filter((item): item is DocumentResponse => 
            item.documents !== null && 
            item.documents.metadata !== null)
          .map(item => {
            const metadata = item.documents.metadata;
            if (!isValidMetadata(metadata)) {
              console.warn('Invalid document metadata:', metadata);
              return null;
            }
            return {
              id: item.documents.id,
              filename: metadata.filename,
              created_at: item.documents.created_at
            };
          })
          .filter((doc): doc is NonNullable<typeof doc> => doc !== null);
      }
      return [];
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error("Erro ao carregar documentos");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { error: assocError } = await supabase
        .from('ai_agent_documents')
        .delete()
        .eq('agent_id', agentId)
        .eq('document_id', documentId);

      if (assocError) throw assocError;

      const { error: docError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (docError) throw docError;

      toast.success("Documento removido com sucesso");
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error("Erro ao remover documento");
      throw error;
    }
  };

  const downloadDocument = async (documentId: string, filename: string) => {
    try {
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('metadata')
        .eq('id', documentId)
        .single();

      if (docError) throw docError;
      
      if (!docData?.metadata || !isValidMetadata(docData.metadata)) {
        throw new Error('Invalid document metadata');
      }

      const { data, error } = await supabase
        .storage
        .from('documents')
        .download(docData.metadata.path || filename);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Download iniciado com sucesso");
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error("Erro ao baixar documento");
    }
  };

  return {
    isLoading,
    loadDocuments,
    deleteDocument,
    downloadDocument
  };
};