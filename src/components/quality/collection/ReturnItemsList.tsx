import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { ReturnItemsDialog } from "./ReturnItemsDialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CollectionStatus } from "@/types/collection";

interface ReturnItemsListProps {
  rncId: string;
  onStatusUpdate: () => void;
}

export function ReturnItemsList({ rncId, onStatusUpdate }: ReturnItemsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  const { data: collections, isLoading } = useQuery({
    queryKey: ["collections", rncId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collection_requests")
        .select(`
          id,
          status,
          created_at,
          collection_address,
          return_items (
            id,
            weight,
            product:products(id, name)
          )
        `)
        .eq("rnc_id", rncId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });

  const handleStatusUpdate = async (collectionId: string, newStatus: CollectionStatus) => {
    try {
      const { error } = await supabase
        .from("collection_requests")
        .update({ status: newStatus })
        .eq("id", collectionId);

      if (error) throw error;

      toast.success("Status atualizado com sucesso");
      onStatusUpdate();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const memoizedCollections = useMemo(() => collections || [], [collections]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      {memoizedCollections.map((collection) => (
        <Card key={collection.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              Coleta #{collection.id.slice(0, 8)}
            </CardTitle>
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
                  Criado em: {format(new Date(collection.created_at), "dd/MM/yyyy HH:mm")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Endereço: {collection.collection_address}
                </p>
              </div>

              {collection.return_items?.length > 0 ? (
                <div>
                  <h4 className="font-medium mb-2">Itens Retornados</h4>
                  <ul className="space-y-2">
                    {collection.return_items.map((item: any) => (
                      <li key={item.id} className="flex justify-between items-center">
                        <span>{item.product?.name}</span>
                        <span>{item.weight}kg</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : collection.status === "pending" ? (
                <Button
                  onClick={() => {
                    setSelectedCollectionId(collection.id);
                    setIsDialogOpen(true);
                  }}
                >
                  Registrar Itens
                </Button>
              ) : null}

              {collection.status === "pending" && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate(collection.id, "in_progress")}
                >
                  Iniciar Coleta
                </Button>
              )}

              {collection.status === "in_progress" && collection.return_items?.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate(collection.id, "completed")}
                >
                  Finalizar Coleta
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedCollectionId && (
        <ReturnItemsDialog
          collectionId={selectedCollectionId}
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setSelectedCollectionId(null);
              onStatusUpdate();
            }
          }}
        />
      )}
    </div>
  );
}