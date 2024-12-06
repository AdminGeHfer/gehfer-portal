import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteRNC, useUpdateRNC } from "@/mutations/rncMutations";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RNC } from "@/types/rnc";

export const useRNCDetailState = (id: string) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteRNC = useDeleteRNC(id, () => {
    navigate("/quality/rnc");
  });

  const updateRNC = useUpdateRNC(id, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rnc", id] });
      setIsEditing(false);
      setIsSaving(false);
      toast.success("RNC atualizada com sucesso");
    },
    onError: (error: Error) => {
      setIsSaving(false);
      toast.error(`Erro ao atualizar RNC: ${error.message}`);
    },
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