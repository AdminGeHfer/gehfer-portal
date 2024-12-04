import { useRef, useState } from "react";
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
import { generatePDF } from "@/utils/pdfUtils";
import { toast } from "sonner";
import { RNCTimeline } from "../RNCTimeline";

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
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleGeneratePDF = async () => {
    if (isGeneratingPDF) return;

    try {
      setIsGeneratingPDF(true);
      
      // Show the report component temporarily
      onPrint();
      
      // Wait for next frame to ensure DOM is updated
      await new Promise(resolve => requestAnimationFrame(resolve));

      if (!reportRef.current) {
        console.error('Report element not found in DOM');
        toast.error("Erro ao gerar PDF: elemento não encontrado");
        return;
      }

      await generatePDF({
        filename: `RNC-${rnc.rnc_number}.pdf`,
        element: reportRef.current
      });

    } catch (error) {
      console.error('Error in handleGeneratePDF:', error);
    } finally {
      setIsGeneratingPDF(false);
      // Hide the report component
      onPrint();
    }
  };

  // Only render the report when isPrinting is true
  if (isPrinting) {
    return (
      <div id="rnc-report" ref={reportRef} className="p-4 bg-white">
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
                  onPrint={handleGeneratePDF}
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