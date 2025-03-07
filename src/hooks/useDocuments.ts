import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Document {
  id: string;
  filename: string;
  content: string | null;
  processed: boolean;
  created_at: string;
  metadata;
}

interface AgentDocument {
  document_id: string;
  documents: Document;
}

export function useDocuments(agentId: string) {
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_agent_documents')
        .select(`
          document_id,
          documents (
            id,
            metadata->>'filename' as filename,
            content,
            processed,
            created_at
          )
        `)
        .eq('agent_id', agentId);

      if (error) throw error;
      
      // Ensure proper type casting and null checking
      if (!data) return [];
      
      // Type assertion after validation
      const validData = data as unknown as AgentDocument[];
      return validData.map(d => d.documents) || [];
    }
  });

  const deleteDocument = useMutation({
    mutationFn: async (documentId: string) => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', agentId] });
      toast.success("Documento removido com sucesso");
    },
    onError: (error) => {
      console.error('Error deleting document:', error);
      toast.error("Erro ao remover documento");
    }
  });

  return {
    documents,
    isLoading,
    deleteDocument: deleteDocument.mutate
  };
}