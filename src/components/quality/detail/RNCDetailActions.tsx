import { Button } from "@/components/ui/button";
import { RNC } from "@/types/rnc";
import { Printer, WhatsappLogo, Trash } from "@phosphor-icons/react";

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
  setIsDeleteDialogOpen
}: RNCDetailActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onPrint}>
        <Printer className="mr-2 h-4 w-4" />
        Imprimir
      </Button>
      <Button variant="outline" onClick={onWhatsApp}>
        <WhatsappLogo weight="fill" className="mr-2 h-4 w-4" />
        WhatsApp
      </Button>
      {canEdit && (
        <>
          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={isEditing ? onSave : onEdit}
          >
            {isEditing ? "Salvar" : "Editar"}
          </Button>
          <Button 
            variant="outline" 
            className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </>
      )}
    </div>
  );
}