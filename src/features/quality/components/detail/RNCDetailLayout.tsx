import { RNCDetailHeader } from "./RNCDetailHeader";
import { RNCDetailContent } from "./RNCDetailContent";
import { RNCDetailActions } from "./RNCDetailActions";
import { RNC } from "@/types/rnc";
import { WorkflowStatusEnum } from "@/types/rnc";

interface RNCDetailLayoutProps {
  rnc: RNC;
  isEditing: boolean;
  canEdit: boolean;
  onEdit: () => void;
  onSave: () => Promise<void>;
  onDelete: () => void;
  onGeneratePDF: () => void;
  onWhatsApp: () => void;
  onStatusChange: (status: WorkflowStatusEnum) => Promise<void>;
  onFieldChange: (field: keyof RNC, value: any) => void;
  onRefresh: () => Promise<void>;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
}

export const RNCDetailLayout = ({
  rnc,
  isEditing,
  canEdit,
  onEdit,
  onSave,
  onDelete,
  onGeneratePDF,
  onWhatsApp,
  onStatusChange,
  onFieldChange,
  onRefresh,
  setIsDeleteDialogOpen,
  isDeleteDialogOpen,
  isDeleting
}: RNCDetailLayoutProps) => {
  return (
    <div className="space-y-6 p-6">
      <RNCDetailHeader
        rnc={rnc}
        isEditing={isEditing}
        canEdit={canEdit}
        onEdit={onEdit}
        onSave={onSave}
        onDelete={onDelete}
        onGeneratePDF={onGeneratePDF}
        onWhatsApp={onWhatsApp}
        onStatusChange={onStatusChange}
        onRefresh={onRefresh}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
      />

      <RNCDetailContent
        rnc={rnc}
        isEditing={isEditing}
        onRefresh={onRefresh}
        onStatusChange={onStatusChange}
        onFieldChange={onFieldChange}
      />

      <RNCDetailActions
        rnc={rnc}
        isEditing={isEditing}
        canEdit={canEdit}
        onEdit={onEdit}
        onSave={onSave}
        onDelete={onDelete}
        onGeneratePDF={onGeneratePDF}
        onWhatsApp={onWhatsApp}
      />
    </div>
  );
};