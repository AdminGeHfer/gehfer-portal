import { supabase } from "@/integrations/supabase/client";
import { RNC } from "@/types/rnc";
import { toast } from "sonner";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { deleteRNCRecord } from "@/mutations/rnc/deleteRNCOperations";

export const useDeleteRNC = (id: string, onSuccess: () => void) => {
  return useMutation({
    mutationFn: async () => {
      console.log('Starting RNC deletion process for ID:', id);
      const success = await deleteRNCRecord(id);
      if (!success) {
        throw new Error('Failed to delete RNC');
      }
    },
    onSuccess: () => {
      toast.success("RNC excluída com sucesso");
      onSuccess();
    },
    onError: (error: Error) => {
      console.error('Error in useDeleteRNC:', error);
      toast.error("Erro ao excluir RNC: " + error.message);
    },
  });
};

export const useUpdateRNC = (
  id: string,
  options?: Partial<UseMutationOptions<void, Error, Partial<RNC>>>
) => {
  return useMutation<void, Error, Partial<RNC>>({
    mutationFn: async (updatedData: Partial<RNC>) => {
      const { error: rncError } = await supabase
        .from("rncs")
        .update({
          description: updatedData.description,
          workflow_status: updatedData.workflow_status,
          priority: updatedData.priority,
          type: updatedData.type,
          department: updatedData.department,
          company: updatedData.company,
          cnpj: updatedData.cnpj,
          order_number: updatedData.order_number,
          return_number: updatedData.return_number,
          resolution: updatedData.resolution,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (rncError) {
        console.error("Error updating RNC:", rncError);
        throw rncError;
      }

      if (updatedData.contact) {
        const { error: contactError } = await supabase
          .from("rnc_contacts")
          .update({
            name: updatedData.contact.name,
            phone: updatedData.contact.phone,
            email: updatedData.contact.email,
            rnc_id: id
          })
          .eq("rnc_id", id);

        if (contactError) {
          console.error("Error updating contact:", contactError);
          throw contactError;
        }
      }
    },
    ...options,
    onSuccess: (data, variables, context) => {
      toast.success("RNC atualizada com sucesso");
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar RNC: " + error.message);
      if (options?.onError) {
        options.onError(error, null as any, null as any);
      }
    },
  });
};
