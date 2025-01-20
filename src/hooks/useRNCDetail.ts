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
      console.log('Fetching RNC details for ID:', id);
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

      if (error) {
        console.error('Error fetching RNC:', error);
        throw error;
      }

      if (!data) {
        console.log('No RNC found with ID:', id);
        return null;
      }

      // Check if user can edit this RNC
      const canEdit = isAdmin || isManager || (userData.user && data.created_by === userData.user.id);
      console.log("User permissions:", { isAdmin, isManager, userId: userData.user?.id, createdBy: data.created_by, canEdit });

      return { ...transformRNCData(data), canEdit };
    },
  });

  const handleEdit = () => {
    console.log('Attempting to edit RNC:', id);
    if (!rnc?.canEdit) {
      console.log('Edit permission denied');
      toast.error("Você não tem permissão para editar esta RNC");
      return;
    }

    // Verificar se o status é "concluded"
    if (rnc.status == "concluded") {
      console.log('Edit denied - RNC is in concluded status');
      toast.error("Apenas RNCs com status diferente de 'Concluído' podem ser editadas");
      return;
    }

    console.log('Edit permission granted');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!rnc || isSaving) return;
    
    console.log('Attempting to save RNC:', id);
    try {
      setIsSaving(true);
      await queryClient.invalidateQueries({ queryKey: ["rnc", id] });
      setIsEditing(false);
      toast.success("RNC atualizada com sucesso");
    } catch (error) {
      console.error('Error saving RNC:', error);
      toast.error("Erro ao atualizar RNC");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    console.log('Attempting to delete RNC:', id);
    if (!rnc?.canEdit || isDeleting) {
      console.log('Delete permission denied');
      return;
    }
    
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("rncs")
        .delete()
        .eq("id", id);

      if (error) {
        console.error('Error deleting RNC:', error);
        throw error;
      }

      console.log('RNC deleted successfully');
      toast.success("RNC excluída com sucesso");
      queryClient.invalidateQueries({ queryKey: ["rncs"] });
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast.error("Erro ao excluir RNC");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (newStatus: WorkflowStatusEnum) => {
    if (!rnc) return;
    
    console.log('Attempting to change RNC status:', { id, newStatus });
    try {
      const { error } = await supabase
        .from("rncs")
        .update({ workflow_status: newStatus })
        .eq("id", id);

      if (error) {
        console.error('Error updating RNC status:', error);
        throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ["rnc", id] });
      toast.success("Status atualizado com sucesso");
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleFieldChange = async (field: keyof RNC, value: unknown) => {
    if (!rnc) return;

    console.log('Attempting to update RNC field:', { id, field, value });
    try {
      const { error } = await supabase
        .from("rncs")
        .update({ [field]: value })
        .eq("id", id);

      if (error) {
        console.error('Error updating RNC field:', error);
        throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ["rnc", id] });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error in handleFieldChange:', error);
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