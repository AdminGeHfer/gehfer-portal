import { useState } from "react";
import { CollectionStatus } from "@/types/collection";
import { CollectionDetailsDialog } from "./CollectionDetailsDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CollectionCard } from "./CollectionCard";

interface CollectionListProps {
  collections: any[];
  onStatusChange: (id: string, status: CollectionStatus) => void;
  onEdit: (collection: any) => void;
  onRefresh: () => void;
}

export function CollectionList({ 
  collections, 
  onStatusChange, 
  onEdit,
  onRefresh 
}: CollectionListProps) {
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleDelete = async (id: string) => {
    const confirmation = window.confirm("Tem certeza que deseja excluir esta coleta?");
    if (!confirmation) return;

    const { error } = await supabase
      .from('collection_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting collection:", error);
      toast.error("Erro ao excluir coleta");
      return;
    }

    toast.success("Coleta excluída com sucesso");
    onRefresh();
  };

  const downloadEvidence = async (evidence: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('collection-evidence')
        .download(evidence.file_path);

      if (error) throw error;

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
      toast.error("Erro ao baixar arquivo");
    }
  };

  return (
    <div className="space-y-6">
      {collections?.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={handleDelete}
          onView={(collection) => {
            setSelectedCollection(collection);
            setIsDetailsOpen(true);
          }}
          onDownloadEvidence={downloadEvidence}
        />
      ))}

      {selectedCollection && (
        <CollectionDetailsDialog
          collection={selectedCollection}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onUpdate={onRefresh}
        />
      )}
    </div>
  );
}