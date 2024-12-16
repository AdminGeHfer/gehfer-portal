import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { DocumentVersion } from "@/types/documents";

interface DocumentVersionListProps {
  documentId: string;
  onVersionChange: () => void;
}

export function DocumentVersionList({ documentId, onVersionChange }: DocumentVersionListProps) {
  const { data: versions, isLoading } = useQuery({
    queryKey: ['document-versions', documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('document_versions')
        .select(`
          id,
          document_id,
          version_number,
          created_at,
          metadata,
          is_active,
          profiles (name)
        `)
        .eq('document_id', documentId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure type safety
      return (data || []).map(version => ({
        ...version,
        metadata: version.metadata as DocumentVersion['metadata']
      })) as DocumentVersion[];
    }
  });

  const handleRollback = async (versionId: string) => {
    try {
      const { error } = await supabase
        .rpc('rollback_document_version', {
          p_version_id: versionId,
          p_document_id: documentId
        });

      if (error) throw error;

      toast.success("Versão restaurada com sucesso");
      onVersionChange();
    } catch (error) {
      console.error('Error rolling back version:', error);
      toast.error("Erro ao restaurar versão");
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Carregando versões...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5" />
        <h3 className="text-lg font-medium">Histórico de Versões</h3>
      </div>

      {versions?.map((version) => (
        <Card key={version.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Versão {version.version_number}</span>
                {version.is_active && (
                  <Badge variant="secondary">Ativa</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Criada por {version.profiles?.name} em{' '}
                {format(new Date(version.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
              {version.metadata && (
                <p className="text-sm text-muted-foreground mt-1">
                  {version.metadata.chunks_count} chunks • 
                  Coerência média: {(version.metadata.avg_coherence * 100).toFixed(1)}%
                </p>
              )}
            </div>
            
            {!version.is_active && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRollback(version.id)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restaurar
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}