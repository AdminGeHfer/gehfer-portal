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
  onDelete,
  onPrint,
  onWhatsApp,
  setIsDeleteDialogOpen,
  isDeleting
}: RNCDetailActionsProps) {
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
      {canEdit && (
        <>
          <Button 
            variant={isEditing ? "default" : "outline"}
            className={isEditing ? "" : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"}
            onClick={isEditing ? onSave : onEdit}
          >
            <PencilSimple className="mr-2 h-4 w-4" />
            {isEditing ? "Salvar" : "Editar"}
          </Button>
          <Button 
            variant="outline" 
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 bg-white dark:bg-gray-800"
            onClick={() => setIsDeleteDialogOpen(true)}
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