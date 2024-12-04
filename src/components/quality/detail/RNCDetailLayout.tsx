import { Card } from "@/components/ui/card";
import { RNCDetailHeader } from "./RNCDetailHeader";
import { RNCDetailForm } from "./RNCDetailForm";
import { RNCAttachments } from "./RNCAttachments";
import { RNCWorkflowStatus } from "../workflow/RNCWorkflowStatus";
import { RNCDeleteDialog } from "./RNCDeleteDialog";
import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { Header } from "@/components/layout/Header";
import { RefetchOptions } from "@tanstack/react-query";
import { RNCReport } from "../report/RNCReport";
import { RNCTimeline } from "../RNCTimeline";
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface RNCDetailLayoutProps {
  rnc: RNC;
  isEditing: boolean;
  isPrinting: boolean;
  isDeleteDialogOpen: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onPrint: () => void;
  onWhatsApp: () => void;
  onFieldChange: (field: keyof RNC, value: any) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isDeleting: boolean;
  canEdit: boolean;
  onRefresh: (options?: RefetchOptions) => Promise<void>;
  onStatusChange: (newStatus: WorkflowStatusEnum) => Promise<void>;
}

export function RNCDetailLayout({
  rnc,
  isEditing,
  isPrinting,
  isDeleteDialogOpen,
  onEdit,
  onSave,
  onDelete,
  onPrint,
  onWhatsApp,
  onFieldChange,
  setIsDeleteDialogOpen,
  isDeleting,
  canEdit,
  onRefresh,
  onStatusChange,
}: RNCDetailLayoutProps) {
  const handlePrint = async () => {
    const element = document.getElementById('rnc-report');
    if (!element) return;

    const opt = {
      margin: 10,
      filename: `RNC-${rnc.rnc_number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  if (isPrinting) {
    return (
      <div id="rnc-report" className="p-8 bg-white min-h-screen">
        <RNCReport rnc={rnc} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-1">
        <div className="grid gap-2 lg:grid-cols-12">
          {/* Workflow Status - Com mais destaque */}
          <div className="lg:col-span-4 lg:order-2">
            <div className="sticky top-4 space-y-2">
              <Card className="p-4 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <RNCWorkflowStatus 
                  rncId={rnc.id}
                  currentStatus={rnc.workflow_status}
                  onStatusChange={onStatusChange}
                  onRefresh={onRefresh}
                />
              </Card>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-8 lg:order-1 space-y-2">
            <Card className="bg-white/90 backdrop-blur-sm shadow-md">
              <div className="p-2">
                <RNCDetailHeader 
                  rnc={rnc}
                  isEditing={isEditing}
                  onEdit={onEdit}
                  onSave={onSave}
                  onDelete={onDelete}
                  onPrint={handlePrint}
                  onWhatsApp={onWhatsApp}
                  canEdit={canEdit}
                  onStatusChange={onStatusChange}
                  onRefresh={onRefresh}
                  setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                  isDeleteDialogOpen={isDeleteDialogOpen}
                  isDeleting={isDeleting}
                />
              </div>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm shadow-md p-4">
              <RNCDetailForm
                rnc={rnc}
                isEditing={isEditing}
                onFieldChange={onFieldChange}
              />
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm shadow-md p-4">
              <RNCAttachments rncId={rnc.id} />
            </Card>

            {/* Histórico do Workflow - Centralizado abaixo */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-md p-4">
              <RNCTimeline rncId={rnc.id} />
            </Card>
          </div>
        </div>
      </main>

      <RNCDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}