import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRNCRecord } from "./rnc/deleteRNCOperations";
import { updateRNCRecord } from "./rnc/updateRNCOperations";
import { RNC } from "@/types/rnc";
import { toast } from "sonner";

export const useDeleteRNC = (id: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const result = await deleteRNCRecord(id);
        return result;
      } catch (error: any) {
        console.error("Delete error:", error);
        throw error;
      }
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["rncs"] });
      await queryClient.cancelQueries({ queryKey: ["rnc", id] });

      // Snapshot the previous value
      const previousRNCs = queryClient.getQueryData<RNC[]>(["rncs"]);

      // Optimistically remove the RNC from the cache
      if (previousRNCs) {
        queryClient.setQueryData<RNC[]>(["rncs"], 
          previousRNCs.filter(rnc => rnc.id !== id)
        );
      }

      return { previousRNCs };
    },
    onSuccess: () => {
      // Remove the RNC from the cache
      queryClient.removeQueries({ queryKey: ["rnc", id] });
      queryClient.invalidateQueries({ queryKey: ["rncs"] });
      
      toast.success("RNC excluída com sucesso");
      if (onSuccess) onSuccess();
    },
    onError: (error: any, variables, context) => {
      // Rollback to the previous value if available
      if (context?.previousRNCs) {
        queryClient.setQueryData(["rncs"], context.previousRNCs);
      }
      console.error("Delete error:", error);
      toast.error("Erro ao excluir RNC");
    },
  });
};

export const useUpdateRNC = (id: string, options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RNC) => {
      const result = await updateRNCRecord(id, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rnc", id] });
      queryClient.invalidateQueries({ queryKey: ["rncs"] });
      toast.success("RNC atualizada com sucesso");
      if (options?.onSuccess) options.onSuccess();
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      toast.error("Erro ao atualizar RNC");
    },
  });
};