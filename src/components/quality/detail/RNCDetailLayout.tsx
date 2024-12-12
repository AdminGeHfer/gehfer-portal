import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { Header } from "@/components/layout/Header";

export interface RNCDetailLayoutProps {
  rnc: RNC;
  isEditing: boolean;
  isGeneratingPDF: boolean;
  isDeleteDialogOpen: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onGeneratePDF: () => void;
  onWhatsApp: () => void;
  onFieldChange: (field: keyof RNC, value: any) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isDeleting: boolean;
  canEdit: boolean;
  onRefresh: () => Promise<void>;
  onStatusChange: (status: WorkflowStatusEnum) => Promise<void>;
  children?: React.ReactNode;
}

export function RNCDetailLayout({
  rnc,
  isEditing,
  isGeneratingPDF,
  isDeleteDialogOpen,
  onEdit,
  onSave,
  onDelete,
  onGeneratePDF,
  onWhatsApp,
  setIsDeleteDialogOpen,
  isDeleting,
  canEdit,
  onRefresh,
  onStatusChange,
  onFieldChange,
  children
}: RNCDetailLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header title={`RNC #${rnc.rnc_number || '-'}`} />
      <main className="container mx-auto py-1">
        <div className="space-y-4">
          {children}
        </div>
      </main>
    </div>
  );
}