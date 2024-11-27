import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileIcon, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollectionDetailsProps {
  rncId: string;
  onStatusUpdate: () => void;
  showEvidence?: boolean;
}

export function CollectionDetails({ rncId, onStatusUpdate, showEvidence = false }: CollectionDetailsProps) {
  const { data: collections, isLoading } = useQuery({
    queryKey: ["collections", rncId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collection_requests")
        .select(`
          *,
          rnc:rncs(rnc_number),
          return_items (
            *,
            product:products(id, name)
          ),
          collection_evidence (
            *
          )
        `)
        .eq("rnc_id", rncId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const downloadEvidence = async (evidence: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('collection-evidence')
        .download(evidence.file_path);

      if (error) throw error;

      // Create and trigger download
      const blob = new Blob([data], { type: evidence.content_type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = evidence.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading evidence:", error);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!collections || collections.length === 0) {
    return <div>Nenhuma coleta encontrada</div>;
  }

  return (
    <div className="space-y-6">
      {collections.map((collection) => (
        <Card key={collection.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Coleta #{collection.id.slice(0, 8)}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Criado em: {format(new Date(collection.created_at), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
            <Badge
              variant={collection.status === "completed" ? "default" : "secondary"}
            >
              {collection.status === "pending"
                ? "Pendente"
                : collection.status === "in_progress"
                ? "Em Andamento"
                : "Concluído"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Endereço: {collection.collection_address}
                </p>
                {collection.notes && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Observações: {collection.notes}
                  </p>
                )}
              </div>

              {collection.return_items && collection.return_items.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Itens para Coleta</h4>
                  <ul className="space-y-2">
                    {collection.return_items.map((item: any) => (
                      <li key={item.id} className="flex justify-between items-center">
                        <span>{item.product?.name || 'Produto não encontrado'}</span>
                        <span>{item.weight}kg</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {showEvidence && collection.collection_evidence && collection.collection_evidence.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Evidências</h4>
                  <div className="grid gap-2">
                    {collection.collection_evidence.map((evidence: any) => (
                      <div
                        key={evidence.id}
                        className="flex items-center justify-between p-2 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          {getFileIcon(evidence.filename)}
                          <span className="text-sm">{evidence.filename}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadEvidence(evidence)}
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {collection.arrival_date && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Data de Chegada: {format(new Date(collection.arrival_date), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}