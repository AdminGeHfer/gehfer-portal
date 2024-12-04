import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReturnItemsForm } from "./ReturnItemsForm";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface ReturnItemsDialogProps {
  collectionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReturnItemsDialog({
  collectionId,
  open,
  onOpenChange,
}: ReturnItemsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (items: { product_id: string; weight: number }[]) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not authenticated");

      // Insert all return items
      const { error } = await supabase
        .from("return_items")
        .insert(
          items.map((item) => ({
            collection_id: collectionId,
            product_id: item.product_id,
            weight: item.weight,
            created_by: userData.user.id,
          }))
        );

      if (error) throw error;

      toast.success("Itens de devolução registrados com sucesso");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating return items:", error);
      toast.error("Erro ao registrar itens de devolução");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium">
              2
            </div>
            <DialogTitle>Registrar Produtos para Devolução</DialogTitle>
          </div>
          <p className="text-muted-foreground">
            Selecione os produtos e suas respectivas quantidades para devolução
          </p>
        </DialogHeader>
        <ReturnItemsForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}