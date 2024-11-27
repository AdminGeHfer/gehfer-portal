import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CollectionFormData } from "@/types/collection";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ReturnItemsDialog } from "./ReturnItemsDialog";

interface CollectionRequestFormProps {
  rncId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CollectionRequestForm({ rncId, onSuccess, onCancel }: CollectionRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReturnItems, setShowReturnItems] = useState(false);
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CollectionFormData>({
    collection_address: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      // Create collection request
      const { data: collectionData, error: collectionError } = await supabase
        .from("collection_requests")
        .insert({
          rnc_id: rncId,
          collection_address: formData.collection_address,
          notes: formData.notes,
          created_by: userData.user.id,
        })
        .select()
        .single();

      if (collectionError) throw collectionError;

      setCollectionId(collectionData.id);
      setShowReturnItems(true);
    } catch (error) {
      console.error("Error creating collection request:", error);
      toast.error("Erro ao criar solicitação de coleta");
      setIsSubmitting(false);
    }
  };

  const handleReturnItemsClose = () => {
    setShowReturnItems(false);
    toast.success("Solicitação de coleta criada com sucesso");
    onSuccess();
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium">
            1
          </div>
          <h3 className="text-lg font-medium">Informações da Coleta</h3>
        </div>
        <p className="text-muted-foreground">
          Preencha as informações básicas para a coleta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="required-field">Endereço de Coleta</Label>
            <Input
              name="collection_address"
              value={formData.collection_address}
              onChange={handleChange}
              placeholder="Digite o endereço completo para coleta"
              required
            />
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Informações adicionais sobre a coleta"
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Continuar"}
          </Button>
        </div>
      </form>

      {collectionId && (
        <ReturnItemsDialog
          collectionId={collectionId}
          open={showReturnItems}
          onOpenChange={handleReturnItemsClose}
        />
      )}
    </>
  );
}