import { useEffect, useRef } from "react";
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
// @ts-ignore
import html2pdf from 'html2pdf.js';
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
  const isPrintingRef = useRef(false);

  useEffect(() => {
    isPrintingRef.current = isPrinting;
  }, [isPrinting]);

  const handlePrint = async () => {
    try {
      onPrint(); // Ativa o modo de impressão

      // Aguarda o próximo ciclo de renderização
      await new Promise(resolve => requestAnimationFrame(resolve));

      if (!reportRef.current) {
        console.error('Report element not found in DOM');
        toast.error("Erro ao gerar PDF: elemento não encontrado");
        return;
      }

      const opt = {
        margin: 10,
        filename: `RNC-${rnc.rnc_number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: true,
          windowWidth: 1024,
          windowHeight: 768,
          scrollY: -window.scrollY,
          scrollX: -window.scrollX,
          onrendered: (canvas: HTMLCanvasElement) => {
            console.log('Canvas rendered successfully', canvas.width, canvas.height);
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(reportRef.current).save();
      console.log('PDF generation completed successfully');
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error('Detailed error in PDF generation:', error);
      toast.error(`Erro ao gerar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      // Desativa o modo de impressão após gerar o PDF
      if (isPrintingRef.current) {
        onPrint();
      }
    }
  };

  if (isPrinting) {
    return (
      <div id="rnc-report" ref={reportRef} className="p-8 bg-white min-h-screen">
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