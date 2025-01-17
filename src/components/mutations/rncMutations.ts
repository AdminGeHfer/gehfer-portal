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
          rnc_number: updatedData.rnc_number,
          company_code: updatedData.company_code,
          company: updatedData.company,
          cnpj: updatedData.cnpj,
          type: updatedData.type,
          description: updatedData.description,
          responsible: updatedData.responsible,
          days_left: updatedData.days_left,
          korp: updatedData.korp,
          nfv: updatedData.nfv,
          nfd: updatedData.nfd,
          collected_at: updatedData.collected_at,
          closed_at: updatedData.closed_at,
          city: updatedData.city,
          conclusion: updatedData.conclusion,
          department: updatedData.department,
          assigned_at: updatedData.assigned_at,
          workflow_status: updatedData.workflow_status,
          assigned_to: updatedData.assigned_to,
          assigned_by: updatedData.assigned_by,
          created_by: updatedData.created_by,
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
        options.onError(error, null, null);
      }
    },
  });
};
