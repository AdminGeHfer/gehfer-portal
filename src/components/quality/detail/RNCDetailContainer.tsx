import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRNCDetail } from "@/hooks/useRNCDetail";
import { RNCDetailLayout } from "./RNCDetailLayout";
import { RNCDetailHeader } from "./RNCDetailHeader";
import { RNCDetailActions } from "./RNCDetailActions";
import { RNCDetailContent } from "./RNCDetailContent";
import { toast } from "sonner";
import { RNC } from "@/types/rnc";

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
    handleDelete,
    handleStatusChange,
    handleFieldChange,
    handleRefresh
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
    setIsEditing(false);
    toast.success("RNC atualizada com sucesso");
  };

  const handleWhatsApp = () => {
    if (!rnc) return;
    const phone = rnc.contact.phone.replace(/\D/g, "");
    const message = encodeURIComponent(`Olá! Gostaria de falar sobre a RNC #${rnc.rnc_number}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  if (isLoading || !rnc) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="flex min-h-screen">
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">{isLoading ? "Carregando..." : "RNC não encontrada"}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <RNCDetailLayout
      rnc={rnc}
      isEditing={isEditing}
      isGeneratingPDF={isGeneratingPDF}
      isDeleteDialogOpen={isDeleteDialogOpen}
      onEdit={handleEdit}
      onSave={handleSave}
      onDelete={handleDelete}
      onGeneratePDF={handleGeneratePDF}
      onWhatsApp={handleWhatsApp}
      onFieldChange={handleFieldChange}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      isDeleting={isDeleting}
      canEdit={rnc.canEdit}
      onRefresh={handleRefresh}
      onStatusChange={handleStatusChange}
    >
      <div className="space-y-6 animate-fade-in">
        <RNCDetailHeader
          rnc={rnc}
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onDelete={handleDelete}
          onGeneratePDF={handleGeneratePDF}
          onWhatsApp={handleWhatsApp}
          canEdit={rnc.canEdit}
          onStatusChange={handleStatusChange}
          onRefresh={handleRefresh}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          isDeleteDialogOpen={isDeleteDialogOpen}
          isDeleting={isDeleting}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card dark:bg-gray-800 rounded-lg shadow-sm border p-6">
              <RNCDetailContent
                rnc={rnc}
                isEditing={isEditing}
                onRefresh={handleRefresh}
                onStatusChange={handleStatusChange}
                onFieldChange={handleFieldChange}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-card dark:bg-gray-800 rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Status do Workflow</h2>
              <div className="space-y-4">
                <RNCStatusBadge status={rnc.workflow_status} />
                <textarea
                  className="w-full min-h-[100px] p-3 rounded-md border bg-background resize-none"
                  placeholder="Notas sobre a transição (opcional)"
                />
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => handleStatusChange("analysis")}
                >
                  Em Análise
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <RNCDetailActions
            rnc={rnc}
            isEditing={isEditing}
            canEdit={rnc.canEdit}
            onEdit={handleEdit}
            onSave={handleSave}
            onDelete={handleDelete}
            onGeneratePDF={handleGeneratePDF}
            onWhatsApp={handleWhatsApp}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </RNCDetailLayout>
  );
}