import { useQuery, useQueryClient, RefetchOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformRNCData } from "@/utils/rncTransform";
import { useDeleteRNC, useUpdateRNC } from "@/mutations/rncMutations";
import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useRNCDetail = (id: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: rnc, isLoading, refetch } = useQuery({
    queryKey: ["rnc", id],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("rncs")
        .select(`
          *,
          contact:rnc_contacts(*),
          events:rnc_events(*)
        `)
        .eq("id", id)
        .maybeSingle(); // Changed from single() to maybeSingle()

      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          navigate("/quality/rnc");
          return null;
        }
        throw error;
      }

      if (!data) {
        navigate("/quality/rnc");
        return null;
      }

      if (data.created_by !== user.user?.id) {
        toast.error("Você não tem permissão para editar esta RNC");
        return { ...transformRNCData(data), canEdit: false };
      }

      return { ...transformRNCData(data), canEdit: true };
    },
    retry: false // Don't retry if the record is not found
  });

  const deleteRNC = useDeleteRNC(id, () => {
    queryClient.invalidateQueries({ queryKey: ["rncs"] });
    queryClient.removeQueries({ queryKey: ["rnc", id] });
    navigate("/quality/rnc");
    toast.success("RNC excluída com sucesso");
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