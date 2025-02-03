import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { toast } from "sonner";
import { rncService } from "@/services/rncService";
import { supabase } from "@/lib/supabase";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateRNCFormData, updateRNCSchema } from "@/schemas/rncValidation";
import { RNCDetails } from "@/pages/quality/rnc/RNCDetails";
import { UpdateRNCInput } from "@/types/rnc";

interface EditRNCModalProps {
  open: boolean;
  onClose: () => void;
  rncData: UpdateRNCInput;
  rncId: string;
}

export function EditRNCModal({ open, onClose, rncData, rncId }: EditRNCModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  const defaultValues = {
    company_code: rncData.company_code,
    company: rncData.company,
    document: rncData.document,
    type: rncData.type,
    department: rncData.department,
    responsible: rncData.responsible,
    description: rncData.description,
    korp: rncData.korp,
    nfv: rncData.nfv,
    nfd: rncData.nfd,
    city: rncData.city,
    conclusion: rncData.conclusion,
    products: rncData.products || [],
    contacts: rncData.contacts || [],
    attachments: rncData.attachments || []
  };

  const methods = useForm<UpdateRNCFormData>({
    resolver: zodResolver(updateRNCSchema),
    mode: "onChange",
    defaultValues: defaultValues
  });

  const handleSave = async (formData: UpdateRNCFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading('Atualizando RNC...');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const updateData: UpdateRNCFormData = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      await rncService.update(rncId, updateData);

      if (formData.attachments?.length) {
        const newAttachments = formData.attachments.filter(att => att instanceof File);
        await Promise.all(newAttachments.map((file: File) => 
          rncService.uploadAttachment(rncId, file)
        ));
      }

      toast.dismiss(loadingToast);
      toast.success('RNC atualizada com sucesso!');
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Error updating RNC:', error);
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar RNC');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-blue-100 pb-4 dark:border-blue-900">
          <div className="flex-1 text-center">
            <DialogTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100">
              Editar RNC
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <FormProvider {...methods}>
          <RNCDetails 
            rncId={rncId} 
            onSave={handleSave}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
