import { useQuery, useQueryClient, RefetchOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformRNCData } from "@/utils/rncTransform";
import { useDeleteRNC, useUpdateRNC } from "@/mutations/rncMutations";
import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { toast } from "sonner";

export const useRNCDetail = (id: string) => {
  const queryClient = useQueryClient();

  const { data: rnc, isLoading, refetch } = useQuery({
    queryKey: ["rnc", id],
    queryFn: async () => {
      // Validate if id is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        toast.error("ID inválido para RNC");
        return null;
      }

      const { data: user } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("rncs")
        .select(`
          *,
          contacts:rnc_contacts(*),
          events:rnc_events(*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching RNC:", error);
        toast.error("Erro ao carregar RNC");
        return null;
      }

      if (!data) {
        toast.error("RNC não encontrada");
        return null;
      }

      if (data.created_by !== user.user?.id) {
        toast.error("Você não tem permissão para editar esta RNC");
        return { ...transformRNCData(data), canEdit: false };
      }

      return { ...transformRNCData(data), canEdit: true };
    },
    enabled: Boolean(id),
  });

  const deleteRNC = useDeleteRNC(id, () => {
    toast.success("RNC excluída com sucesso");
    return Promise.resolve();
  });

  const updateRNC = useUpdateRNC(id, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rnc", id] });
    },
  });

  const handleRefresh = async (options?: RefetchOptions): Promise<void> => {
    await refetch(options);
  };

  const handleStatusChange = async (newStatus: WorkflowStatusEnum): Promise<void> => {
    if (!rnc) return;
    const updatedRnc = {
      ...rnc,
      workflow_status: newStatus
    };
    await updateRNC.mutateAsync(updatedRnc);
  };

  return {
    rnc,
    isLoading,
    deleteRNC,
    updateRNC,
    handleRefresh,
    handleStatusChange
  };
};