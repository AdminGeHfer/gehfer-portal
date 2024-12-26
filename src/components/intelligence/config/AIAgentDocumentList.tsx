import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types/json";

interface Document {
  id: string;
  filename: string;
  created_at: string;
}

interface AIAgentDocumentListProps {
  agentId: string;
}

interface DocumentMetadata {
  filename: string;
  contentType: string;
  size: number;
  path: string;
}

interface SupabaseDocument {
  id: string;
  metadata: Json;
  created_at: string;
}

interface DocumentResponse {
  document_id: string;
  documents: SupabaseDocument;
}

function isDocumentMetadata(metadata: unknown): metadata is DocumentMetadata {
  if (!metadata || typeof metadata !== 'object') return false;
  const m = metadata as Record<string, unknown>;
  return typeof m.path === 'string' && 
         typeof m.filename === 'string' && 
         typeof m.contentType === 'string' && 
         typeof m.size === 'number';
}

export const AIAgentDocumentList = ({ agentId }: AIAgentDocumentListProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (agentId) {
      loadDocuments();
    }
  }, [agentId]);

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
        const formattedDocs = data
          .filter((item): item is DocumentResponse => 
            item.documents !== null && 
            item.documents.metadata !== null)
          .map(item => {
            const metadata = item.documents.metadata;
            if (!isDocumentMetadata(metadata)) {
              console.warn('Invalid document metadata:', metadata);
              return null;
            }
            return {
              id: item.documents.id,
              filename: metadata.filename,
              created_at: item.documents.created_at
            };
          })
          .filter((doc): doc is Document => doc !== null);

        setDocuments(formattedDocs);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error("Erro ao carregar documentos");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!agentId) return;

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

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success("Documento removido com sucesso");
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error("Erro ao remover documento");
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
      
      if (!docData?.metadata || !isDocumentMetadata(docData.metadata)) {
        throw new Error('Invalid document metadata');
      }

      const { data, error } = await supabase
        .storage
        .from('documents')
        .download(docData.metadata.path);

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

  if (isLoading) {
    return <div>Carregando documentos...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Documentos da Base de Conhecimento</h3>
      {documents.length === 0 ? (
        <p className="text-muted-foreground">Nenhum documento encontrado</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{doc.filename}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => downloadDocument(doc.id, doc.filename)}
                  className="text-primary hover:text-primary/90"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteDocument(doc.id)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};