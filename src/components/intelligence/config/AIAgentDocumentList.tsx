import { useEffect, useState } from "react";
import { Document } from "@/types/documents/metadata";
import { DocumentListItem } from "@/components/intelligence/documents/DocumentListItem";
import { useDocumentOperations } from "@/hooks/useDocumentOperations";

interface AIAgentDocumentListProps {
  agentId: string;
}

export const AIAgentDocumentList = ({ agentId }: AIAgentDocumentListProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { isLoading, loadDocuments, deleteDocument, downloadDocument } = useDocumentOperations(agentId);

  useEffect(() => {
    if (agentId) {
      loadDocuments().then(setDocuments);
    }
  }, [agentId]);

  const handleDelete = async (documentId: string) => {
    await deleteDocument(documentId);
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
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
            <DocumentListItem
              key={doc.id}
              document={doc}
              onDownload={downloadDocument}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};