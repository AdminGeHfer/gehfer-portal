import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { transformRNCData } from "@/utils/rncTransform";
import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { toast } from "sonner";
import { useRBAC } from "./useRBAC";

export const useRNCDetail = (id: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const { isAdmin, isManager } = useRBAC();

  const { data: rnc, isLoading, refetch } = useQuery({
    queryKey: ["rnc", id],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("rncs")
        .select(`
          *,
          contact:rnc_contacts(*),
          events:rnc_events(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      // Check if user can edit this RNC
      const canEdit = isAdmin || isManager || (userData.user && data.created_by === userData.user.id);
      console.log("User permissions:", { isAdmin, isManager, userId: userData.user?.id, createdBy: data.created_by, canEdit });

      return { ...transformRNCData(data), canEdit };
    },
  });

  const handleEdit = () => {
    if (!rnc) return;
    
    if (isAdmin || isManager || rnc.canEdit) {
      setIsEditing(true);
    } else {
      toast.error("Você não tem permissão para editar esta RNC");
    }
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
    if ((!isAdmin && !isManager && !rnc?.canEdit) || isDeleting) return;
    
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

  const handleFieldChange = async (field: keyof RNC, value) => {
    if (!rnc) return;

    try {
      const { error } = await supabase
        .from("rncs")
        .update({ [field]: value })
        .eq("id", id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["rnc", id] });
    } catch {
      toast.error(`Erro ao atualizar ${field}`);
    }
  };

  const handleRefresh = async () => {
    await refetch();
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
    handleRefresh
  };
};