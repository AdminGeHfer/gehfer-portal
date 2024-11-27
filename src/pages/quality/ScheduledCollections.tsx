import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CollectionStatus } from "@/types/collection";
import { CollectionList } from "@/components/quality/collection/CollectionList";

const ScheduledCollections = () => {
  const navigate = useNavigate();
  const [editingCollection, setEditingCollection] = useState<any>(null);

  const { data: collections, isLoading, refetch } = useQuery({
    queryKey: ["scheduled-collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collection_requests")
        .select(`
          *,
          rnc:rncs(rnc_number),
          return_items (
            *,
            product:products(id, name)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleStatusChange = async (collectionId: string, newStatus: CollectionStatus) => {
    const { error } = await supabase
      .from("collection_requests")
      .update({ status: newStatus })
      .eq("id", collectionId);

    if (error) {
      toast.error("Erro ao atualizar status");
      return;
    }

    toast.success("Status atualizado com sucesso");
    refetch();
  };

  const handleSaveEdit = async () => {
    if (!editingCollection) return;

    const { error } = await supabase
      .from("collection_requests")
      .update({
        collection_address: editingCollection.collection_address,
        notes: editingCollection.notes,
      })
      .eq("id", editingCollection.id);

    if (error) {
      toast.error("Erro ao atualizar coleta");
      return;
    }

    toast.success("Coleta atualizada com sucesso");
    setEditingCollection(null);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Coletas Programadas" />
      
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-card">
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/apps")}
            >
              Voltar para Apps
            </Button>
          </div>
          <nav className="space-y-1 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/quality/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/quality/rnc")}
            >
              RNCs
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
            >
              Coletas
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="space-y-6">
            {isLoading ? (
              <p>Carregando...</p>
            ) : collections?.length === 0 ? (
              <p>Nenhuma coleta programada</p>
            ) : (
              <CollectionList
                collections={collections}
                onStatusChange={handleStatusChange}
                onEdit={setEditingCollection}
                onRefresh={refetch}
              />
            )}
          </div>
        </main>
      </div>

      <Dialog open={!!editingCollection} onOpenChange={(open) => !open && setEditingCollection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Coleta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Endereço de Coleta</Label>
              <Input
                value={editingCollection?.collection_address || ""}
                onChange={(e) => setEditingCollection({
                  ...editingCollection,
                  collection_address: e.target.value
                })}
              />
            </div>
            <div>
              <Label>Observações</Label>
              <Input
                value={editingCollection?.notes || ""}
                onChange={(e) => setEditingCollection({
                  ...editingCollection,
                  notes: e.target.value
                })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingCollection(null)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduledCollections;
