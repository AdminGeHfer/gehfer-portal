import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformRNCData } from "@/utils/rncTransform";
import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { toast } from "sonner";
import { useRBAC } from "./useRBAC";
import { useAuth } from "./useAuth";

export const useRNCDetail = (id: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const { isAdmin } = useRBAC();
  const { user } = useAuth();

  const canEditRNC = (rnc: RNC): boolean => {
    if (!user?.id) return false;

    if (isAdmin) return true;

    const editableStatuses = ['not_created', 'pending', 'collect'];
    if (!editableStatuses.includes(rnc.status)) {
      return false;
    }

    const userId = user.id;
    const canEdit = userId && (
      rnc.created_by === userId ||
      rnc.assigned_by === userId ||
      rnc.assigned_to === userId
    );

    return Boolean(canEdit);
  };

  const { data: rnc, isLoading, refetch } = useQuery({
    queryKey: ["rnc", id],
    queryFn: async () => {
      console.log("[RNC Detail] Starting to fetch RNC:", id);
      
      if (!id) {
        console.log("[RNC Detail] No ID provided");
        return null;
      }

      try {
        const { data: user } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("rncs")
          .select(`
            *,
            contact:rnc_contacts(*),
            events:rnc_events(*),
            products:rnc_products(*)
          `)
          .eq("id", id)
          .single();

        if (error) {
          console.error("[RNC Detail] Error fetching RNC:", error);
          throw error;
        }

        if (!data) {
          console.log("[RNC Detail] No RNC found with ID:", id);
          return null;
        }

        console.log("[RNC Detail] RNC data fetched successfully:", data);
        const transformedData = transformRNCData(data);
        const canEdit = canEditRNC(transformedData);
        
        return { ...transformedData, canEdit };
      } catch (error) {
        console.error("[RNC Detail] Error in query function:", error);
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id && !!user?.id, // Only run query if we have both id and user
  });

  const handleEdit = () => {
    if (!rnc?.canEdit) {
      toast.error("Você não tem permissão para editar esta RNC");
      return;
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!rnc || isSaving) return;
    
    try {
      setIsSaving(true);
      await queryClient.invalidateQueries({ queryKey: ["rnc", id] });
      setIsEditing(false);
      toast.success("RNC atualizada com sucesso");
    } catch {
      toast.error("Erro ao atualizar RNC");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!rnc?.canEdit || isDeleting) return;
    
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("rncs")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("RNC excluída com sucesso");
      queryClient.invalidateQueries({ queryKey: ["rncs"] });
    } catch {
      toast.error("Erro ao excluir RNC");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (newStatus: WorkflowStatusEnum) => {
    if (!rnc) return;
    
    try {
      const { error } = await supabase
        .from("rncs")
        .update({ workflow_status: newStatus })
        .eq("id", id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["rnc", id] });
      toast.success("Status atualizado com sucesso");
    } catch {
      toast.error("Erro ao atualizar status");
    }
  };

  const handleFieldChange = async (field: keyof RNC, value: unknown) => {
    if (!rnc) return;

    try {
      const { error } = await supabase
        .from("rncs")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["rnc", id] });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Erro ao atualizar ${field}: ${error.message}`);
      } else {
        toast.error(`Erro ao atualizar ${field}`);
      }
    }
  };

  return {
    rnc,
    isLoading,
    isEditing,
    isDeleting,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEdit,
    handleSave,
    handleDelete,
    handleStatusChange,
    handleFieldChange,
    refetch
  };
};