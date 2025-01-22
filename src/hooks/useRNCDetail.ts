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
    // Admin can edit any RNC
    if (isAdmin) {
      console.log('User is admin, can edit RNC');
      return true;
    }

    // Check status condition
    const editableStatuses = ['not_created', 'pending', 'collect'];
    if (!editableStatuses.includes(rnc.status)) {
      console.log('RNC status not editable:', rnc.status);
      return false;
    }

    // Check user permissions
    const userId = user?.id;
    const canEdit = userId && (
      rnc.created_by === userId ||
      rnc.assigned_by === userId ||
      rnc.assigned_to === userId
    );

    console.log('User permissions check:', {
      userId,
      createdBy: rnc.created_by,
      assignedBy: rnc.assigned_by,
      assignedTo: rnc.assigned_to,
      canEdit,
      status: rnc.status,
      rncNumber: rnc.rnc_number
    });

    return Boolean(canEdit);
  };

  const { data: rnc, isLoading, refetch } = useQuery({
    queryKey: ["rnc", id],
    queryFn: async () => {
      console.log('Fetching RNC details for ID:', id);
      const { data, error } = await supabase
        .from("rncs")
        .select(`
          *,
          contact:rnc_contacts(*),
          events:rnc_events(*),
          products:rnc_products(*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching RNC:', error);
        throw error;
      }

      if (!data) {
        console.log('No RNC found with ID:', id);
        return null;
      }

      const transformedData = transformRNCData(data);
      console.log("Transformed RNC data:", transformedData);
      
      // Add canEdit property based on our logic
      const canEdit = canEditRNC(transformedData);
      console.log("Final canEdit value:", canEdit);
      return { ...transformedData, canEdit };
    },
  });

  const handleEdit = () => {
    console.log('Attempting to edit RNC:', id);
    if (!rnc?.canEdit) {
      console.log('Edit permission denied');
      toast.error("Você não tem permissão para editar esta RNC");
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
        toast.error(`Erro ao atualizar ${field}: ${error.message}`);
        return;
      }

      console.log(`Successfully updated field ${field} for RNC ${id}`);
      await queryClient.invalidateQueries({ queryKey: ["rnc", id] });
    } catch (error) {
      console.error('Error in handleFieldChange:', error);
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