import * as React from "react";
import { Button } from "@/components/ui/button";
import { RNC } from "@/types/rnc";
import { Printer, WhatsappLogo, Trash, PencilSimple } from "@phosphor-icons/react";

interface RNCDetailActionsProps {
  rnc: RNC;
  canEdit: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onPrint: () => void;
  onWhatsApp: () => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isDeleting: boolean;
}

export function RNCDetailActions({
  rnc,
  canEdit,
  isEditing,
  onEdit,
  onSave,
  onPrint,
  onWhatsApp,
  setIsDeleteDialogOpen,
  isDeleting
}: RNCDetailActionsProps) {
  const handleEditClick = () => {
    console.log('Edit button clicked for RNC:', rnc.id);
    console.log('Current edit permission:', canEdit);
    if (isEditing) {
      onSave();
    } else {
      onEdit();
    }
  };

  const handleDeleteClick = () => {
    console.log('Delete button clicked for RNC:', rnc.id);
    console.log('Current edit permission:', canEdit);
    setIsDeleteDialogOpen(true);
  };

  const editableStatuses = ['not_created', 'pending', 'collect'];
  const showEditButton = canEdit && editableStatuses.includes(rnc.status);

  console.log('RNCDetailActions render:', {
    rncNumber: rnc.rnc_number,
    status: rnc.status,
    canEdit,
    editableStatuses,
    showEditButton
  });

  return (
    <div className="flex gap-2 animate-fade-in">
      <Button 
        variant="outline" 
        className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={onPrint}
      >
        <Printer className="mr-2 h-4 w-4" />
        Imprimir
      </Button>
      <Button 
        variant="outline"
        className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={onWhatsApp}
      >
        <WhatsappLogo weight="fill" className="mr-2 h-4 w-4" />
        WhatsApp
      </Button>
      {showEditButton && (
        <>
          <Button 
            variant={isEditing ? "default" : "outline"}
            className={isEditing ? "" : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"}
            onClick={handleEditClick}
            disabled={isEditing}
          >
            <PencilSimple className="mr-2 h-4 w-4" />
            {isEditing ? "Salvar" : "Editar"}
          </Button>
          <Button 
            variant="outline" 
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 bg-white dark:bg-gray-800"
            onClick={handleDeleteClick}
            disabled={isDeleting}
          >
            <Trash className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </>
      )}
    </div>
  );
}