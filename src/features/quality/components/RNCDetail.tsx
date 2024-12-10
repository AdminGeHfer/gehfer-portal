import { useRNCDetail } from "../hooks/useRNCDetail";
import { RNCDetailLayout } from "./detail/RNCDetailLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface RNCDetailProps {
  id: string;
}

export const RNCDetail = ({ id }: RNCDetailProps) => {
  const {
    rnc,
    isLoading,
    isEditing,
    isDeleting,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEdit,
    handleSave,
    handleDelete,
    handleStatusChange,
    handleFieldChange,
    refetch
  } = useRNCDetail(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!rnc) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>RNC não encontrada</p>
      </div>
    );
  }

  return (
    <RNCDetailLayout
      rnc={rnc}
      isEditing={isEditing}
      canEdit={rnc.canEdit}
      onEdit={handleEdit}
      onSave={handleSave}
      onDelete={handleDelete}
      onGeneratePDF={() => {}}
      onWhatsApp={() => {}}
      onStatusChange={handleStatusChange}
      onFieldChange={handleFieldChange}
      onRefresh={refetch}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      isDeleteDialogOpen={isDeleteDialogOpen}
      isDeleting={isDeleting}
    />
  );
};