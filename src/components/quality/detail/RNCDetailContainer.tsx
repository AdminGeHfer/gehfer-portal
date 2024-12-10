import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRNCDetail } from "@/hooks/useRNCDetail";
import { toast } from "sonner";
import { RNCDetailLayout } from "./RNCDetailLayout";
import { RNCDetailHeader } from "./RNCDetailHeader";
import { RNCDetailActions } from "./RNCDetailActions";
import { RNCDetailContent } from "./RNCDetailContent";

export function RNCDetailContainer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    rnc,
    isLoading,
    deleteRNC,
    updateRNC,
    handleRefresh,
    handleStatusChange
  } = useRNCDetail(id!);

  const handleGeneratePDF = () => {
    setIsGeneratingPDF(!isGeneratingPDF);
  };

  const handleEdit = () => {
    if (!rnc?.canEdit) {
      toast.error("Você não tem permissão para editar esta RNC");
      return;
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!rnc) return;
    await updateRNC.mutateAsync(rnc);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!rnc?.canEdit) {
      toast.error("Você não tem permissão para excluir esta RNC");
      return;
    }
    
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      await deleteRNC.mutateAsync();
      navigate("/quality/rnc");
    } catch (error) {
      toast.error("Erro ao excluir RNC");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleWhatsApp = () => {
    if (!rnc) return;
    const phone = rnc.contact.phone.replace(/\D/g, "");
    const message = encodeURIComponent(`Olá! Gostaria de falar sobre a RNC #${rnc.rnc_number}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  if (isLoading || !rnc) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex min-h-screen">
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <p>{isLoading ? "Carregando..." : "RNC não encontrada"}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <RNCDetailLayout
      header={
        <RNCDetailHeader
          rnc={rnc}
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
        />
      }
      actions={
        <RNCDetailActions
          rnc={rnc}
          isGeneratingPDF={isGeneratingPDF}
          isDeleteDialogOpen={isDeleteDialogOpen}
          onGeneratePDF={handleGeneratePDF}
          onDelete={handleDelete}
          onWhatsApp={handleWhatsApp}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          isDeleting={isDeleting}
        />
      }
    >
      <RNCDetailContent
        rnc={rnc}
        isEditing={isEditing}
        onRefresh={handleRefresh}
        onStatusChange={handleStatusChange}
      />
    </RNCDetailLayout>
  );
}