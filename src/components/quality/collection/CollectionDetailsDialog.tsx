import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FileUploadField } from "@/components/portaria/FileUploadField";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CollectionEvidence } from "./CollectionEvidence";
import { CollectionHeader } from "./CollectionHeader";
import { CollectionItems } from "./CollectionItems";

interface CollectionDetailsDialogProps {
  collection: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function CollectionDetailsDialog({
  collection,
  open,
  onOpenChange,
  onUpdate,
}: CollectionDetailsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [arrivalDate, setArrivalDate] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleComplete = async () => {
    if (!arrivalDate) {
      toast.error("Por favor, informe a data de chegada");
      return;
    }

    try {
      setIsSubmitting(true);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      // Upload evidence if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${collection.id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('collection-evidence')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        // Create evidence record
        const { error: evidenceError } = await supabase
          .from('collection_evidence')
          .insert({
            collection_id: collection.id,
            filename: selectedFile.name,
            filesize: selectedFile.size,
            content_type: selectedFile.type,
            file_path: filePath,
            evidence_type: 'arrival',
            created_by: userData.user.id,
          });

        if (evidenceError) throw evidenceError;
      }

      // Update collection status
      const { error: updateError } = await supabase
        .from('collection_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          completed_by: userData.user.id,
          arrival_date: new Date(arrivalDate).toISOString(),
        })
        .eq('id', collection.id);

      if (updateError) throw updateError;

      toast.success("Coleta finalizada com sucesso");
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error("Error completing collection:", error);
      toast.error("Erro ao finalizar coleta");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Early return if collection is not properly loaded
  if (!collection || !collection.rnc) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Coleta</DialogTitle>
        </DialogHeader>

        <Card>
          <CollectionHeader collection={collection} />
          <CardContent className="space-y-4">
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

            <CollectionItems items={collection.return_items} />
            <CollectionEvidence evidence={collection.collection_evidence} />

            {collection.arrival_date && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Data de Chegada: {format(new Date(collection.arrival_date), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
            )}

            {collection.status !== 'completed' && (
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <Label>Data de Chegada</Label>
                  <Input
                    type="datetime-local"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                  />
                </div>

                <FileUploadField
                  label="Evidência de Chegada"
                  onChange={handleFileChange}
                  value={selectedFile}
                  onRemove={() => setSelectedFile(null)}
                />

                <div className="flex justify-end">
                  <Button 
                    onClick={handleComplete}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Finalizando..." : "Finalizar Coleta"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}