import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRNCDetail } from "@/hooks/useRNCDetail";
import { RNCTimeline } from "../RNCTimeline";
import { RNCStatusBadge } from "@/components/molecules/RNCStatusBadge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FilePdf, WhatsappLogo, PencilSimple, Trash } from "@phosphor-icons/react";
import { toast } from "sonner";
import { RNCReportPreview } from "../report/RNCReportPreview";
import { RNCDetailForm } from "./RNCDetailForm";

export function RNCDetailContainer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [transitionNotes, setTransitionNotes] = useState("");

  const {
    rnc,
    isLoading,
    handleDelete: onDelete,
    handleStatusChange,
    handleFieldChange,
    handleRefresh
  } = useRNCDetail(id!);

  const handleGeneratePDF = () => {
    if (!rnc) return;
    setIsGeneratingPDF(true);
  };

  const handleWhatsApp = () => {
    if (!rnc) return;
    const text = `RNC #${rnc.rnc_number}\nEmpresa: ${rnc.company}\nDescrição: ${rnc.description}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    await handleRefresh();
    toast.success("RNC atualizada com sucesso");
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
      toast.success("RNC excluída com sucesso");
      navigate("/quality/rncs");
    } catch (error) {
      toast.error("Erro ao excluir RNC");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading || !rnc) {
    return (
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">
              RNC #{rnc.rnc_number}
            </h1>
            <RNCStatusBadge status={rnc.workflow_status} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGeneratePDF}>
              <FilePdf weight="fill" className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={handleWhatsApp}>
              <WhatsappLogo weight="fill" className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            {rnc.canEdit && (
              <>
                <Button 
                  variant={isEditing ? "default" : "outline"}
                  onClick={isEditing ? handleSave : handleEdit}
                >
                  <PencilSimple className="w-4 h-4 mr-2" />
                  {isEditing ? "Salvar" : "Editar"}
                </Button>
                <Button 
                  variant="outline" 
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RNCDetailForm
              rnc={rnc}
              isEditing={isEditing}
              onFieldChange={handleFieldChange}
              onSave={handleSave}
            />

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Histórico do Workflow</h2>
              <RNCTimeline rncId={rnc.id} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Status do Workflow</h2>
              <div className="space-y-4">
                <RNCStatusBadge status={rnc.workflow_status} />
                <Textarea
                  className="w-full min-h-[100px]"
                  placeholder="Notas sobre a transição (opcional)"
                  value={transitionNotes}
                  onChange={(e) => setTransitionNotes(e.target.value)}
                />
                <Button
                  className="w-full"
                  onClick={() => handleStatusChange("analysis")}
                >
                  Próxima Etapa
                </Button>
              </div>
            </div>
          </div>
        </div>

        {isGeneratingPDF && (
          <RNCReportPreview
            rnc={rnc}
            onClose={() => setIsGeneratingPDF(false)}
          />
        )}
      </main>
    </div>
  );
}