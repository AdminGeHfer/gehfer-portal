import { Card } from "@/components/ui/card";
import { RNCDetailHeader } from "./RNCDetailHeader";
import { RNCDetailForm } from "./RNCDetailForm";
import { RNCAttachments } from "./RNCAttachments";
import { RNCWorkflowStatus } from "../workflow/RNCWorkflowStatus";
import { RNCWorkflowHistory } from "../workflow/RNCWorkflowHistory";
import { RNCDeleteDialog } from "./RNCDeleteDialog";
import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { Header } from "@/components/layout/Header";
import { RefetchOptions } from "@tanstack/react-query";
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
  const id = rnc.id;

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
      const pdf = await html2pdf().set(opt).from(element).save();
      return pdf;
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
                  rncId={id}
                  currentStatus={rnc.workflow_status}
                  onStatusChange={onStatusChange}
                  onRefresh={onRefresh}
                />
              </Card>
              <Card className="p-4 bg-white/90 backdrop-blur-sm shadow-md">
                <RNCWorkflowHistory rncId={id} />
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
                  onDelete={() => setIsDeleteDialogOpen(true)}
                  onPrint={onPrint}
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
              <RNCAttachments rncId={id} />
            </Card>
          </div>
        </div>

        {/* Histórico do Workflow - Centralizado abaixo */}
        <div className="mt-6">
          <h3 className="text-base font-semibold text-gray-900 border-b pb-1 mb-4">
            Histórico do Workflow
          </h3>
          <div className="space-y-4">
            {rnc.timeline.map((event, index) => (
              <div key={index} className="relative pl-4 pb-4 text-sm">
                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-gray-400" />
                {index !== rnc.timeline.length - 1 && (
                  <div className="absolute left-1 top-3 w-px h-full bg-gray-200" />
                )}
                <div>
                  <p className="font-medium">{event.title}</p>
                  <time className="text-xs text-gray-500">{event.date}</time>
                  <p className="text-gray-600 mt-1">{event.description}</p>
                  {event.comment && (
                    <p className="text-gray-600 mt-1 italic">"{event.comment}"</p>
                  )}
                </div>
              </div>
            ))}
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
