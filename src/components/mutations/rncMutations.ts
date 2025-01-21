import { supabase } from "@/integrations/supabase/client";
import { RNC } from "@/types/rnc";
import { toast } from "sonner";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { deleteRNCRecord } from "@/mutations/rnc/deleteRNCOperations";
import { updateRNCRecord } from "@/mutations/rnc/updateRNCOperations";

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
      console.log('Starting RNC update with data:', updatedData);
      const success = await updateRNCRecord(id, updatedData);
      if (!success) {
        throw new Error('Failed to update RNC');
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
      console.error('Error in useUpdateRNC:', error);
      toast.error("Erro ao atualizar RNC: " + error.message);
      if (options?.onError) {
        options.onError(error, null, null);
      }
    },
  });
};