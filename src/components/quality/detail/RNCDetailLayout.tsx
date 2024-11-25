import { Header } from "@/components/layout/Header";
import { RNCTimeline } from "@/components/quality/RNCTimeline";
import { RNCPrintLayout } from "@/components/quality/RNCPrintLayout";
import { RNCDetailHeader } from "./RNCDetailHeader";
import { RNCDetailForm } from "./RNCDetailForm";
import { RNCDeleteDialog } from "./RNCDeleteDialog";
import { RNC } from "@/types/rnc";
import { toast } from "sonner";

interface RNCDetailLayoutProps {
  rnc: RNC;
  id: string;
  isEditing: boolean;
  isPrinting: boolean;
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  canEdit: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onPrint: () => void;
  onWhatsApp: () => void;
  onFieldChange: (field: keyof RNC, value: any) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
}

export const RNCDetailLayout = ({
  rnc,
  id,
  isEditing,
  isPrinting,
  isDeleteDialogOpen,
  isDeleting,
  canEdit,
  onEdit,
  onSave,
  onDelete,
  onPrint,
  onWhatsApp,
  onFieldChange,
  setIsDeleteDialogOpen,
}: RNCDetailLayoutProps) => {
  const handleStatusChange = async (status: string) => {
    try {
      onFieldChange("status", status);
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  if (isPrinting) {
    return <RNCPrintLayout rnc={rnc} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 no-print">
      <Header title="Qualidade" />
      
      <div className="flex min-h-screen">
        <main className="flex-1 p-6">
          <RNCDetailHeader
            id={rnc.rnc_number?.toString() || id}
            rnc={rnc}
            isEditing={isEditing}
            onEdit={onEdit}
            onSave={onSave}
            onDelete={() => setIsDeleteDialogOpen(true)}
            onPrint={onPrint}
            onWhatsApp={onWhatsApp}
            canEdit={canEdit}
            onStatusChange={handleStatusChange}
          />

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <RNCDetailForm
                rnc={rnc}
                isEditing={isEditing}
                onChange={onFieldChange}
              />
            </div>
            
            <div className="space-y-6">
              <RNCTimeline events={rnc.timeline} />
            </div>
          </div>

          <RNCDeleteDialog 
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={onDelete}
            isDeleting={isDeleting}
          />
        </main>
      </div>
    </div>
  );
};