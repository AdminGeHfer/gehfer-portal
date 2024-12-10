import { useRNCDetail } from "../hooks/useRNCDetail";
import { RNCDetailLayout } from "./detail/RNCDetailLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useState } from "react";

interface RNCDetailProps {
  id: string;
}

export const RNCDetail = ({ id }: RNCDetailProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
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
    handleRefresh
  } = useRNCDetail(id);

  const handleGeneratePDF = () => {
    setIsGeneratingPDF(!isGeneratingPDF);
  };

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
      isGeneratingPDF={isGeneratingPDF}
      canEdit={rnc.canEdit}
      onEdit={handleEdit}
      onSave={handleSave}
      onDelete={handleDelete}
      onGeneratePDF={handleGeneratePDF}
      onWhatsApp={() => {}}
      onStatusChange={handleStatusChange}
      onFieldChange={handleFieldChange}
      onRefresh={handleRefresh}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      isDeleteDialogOpen={isDeleteDialogOpen}
      isDeleting={isDeleting}
    />
  );
};