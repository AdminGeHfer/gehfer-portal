import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteRNC, useUpdateRNC } from "@/mutations/rncMutations";
import { RNC } from "@/types/rnc";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useRNCDetailState = (id: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const deleteRNC = useDeleteRNC(id, () => {
    toast.success("RNC excluída com sucesso");
    navigate("/quality/rnc");
  });

  const updateRNC = useUpdateRNC(id, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rnc", id] });
      queryClient.invalidateQueries({ queryKey: ["rncs"] });
      setIsEditing(false);
      setIsSaving(false);
      toast.success("RNC atualizada com sucesso");
    },
    onError: (error: Error) => {
      setIsSaving(false);
      toast.error(`Erro ao atualizar RNC: ${error.message}`);
      console.error("Update error:", error);
    }
  });

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isGeneratingPDF,
    setIsGeneratingPDF,
    isEditing,
    setIsEditing,
    isDeleting,
    setIsDeleting,
    isSaving,
    setIsSaving,
    deleteRNC,
    updateRNC
  };
};