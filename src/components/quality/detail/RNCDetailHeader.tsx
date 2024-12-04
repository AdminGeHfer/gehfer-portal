import { Button } from "@/components/atoms/Button";
import { Package, FilePdf, WhatsappLogo, Trash, PencilSimple } from "@phosphor-icons/react";
import { RNC } from "@/types/rnc";
import { RNCStatusBadge } from "@/components/molecules/RNCStatusBadge";
import { CollectionRequestDialog } from "../collection/CollectionRequestDialog";
import { useState } from "react";
import { RNCDeleteDialog } from "./RNCDeleteDialog";

interface RNCDetailHeaderProps {
  rnc: RNC;
  isEditing: boolean;
  canEdit: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onGeneratePDF: () => void;
  onWhatsApp: () => void;
  onStatusChange: (status: string) => void;
  onRefresh: () => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
}

export const RNCDetailHeader = ({
  rnc,
  isEditing,
  canEdit,
  onEdit,
  onSave,
  onDelete,
  onGeneratePDF,
  onWhatsApp,
  onStatusChange,
  onRefresh,
  setIsDeleteDialogOpen,
  isDeleteDialogOpen,
  isDeleting
}: RNCDetailHeaderProps) => {
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-3 min-w-[200px]">
        <h1 className="text-xl font-semibold truncate">RNC #{rnc.rnc_number || "Novo"}</h1>
        <RNCStatusBadge status={rnc.workflow_status} />
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <Button variant="outline" size="sm" onClick={() => setIsCollectionDialogOpen(true)}>
          <Package className="w-4 h-4 mr-1" />
          Solicitar Coleta
        </Button>
        <Button variant="outline" size="sm" onClick={onGeneratePDF}>
          <FilePdf className="w-4 h-4 mr-1" />
          PDF
        </Button>
        <Button variant="outline" size="sm" onClick={onWhatsApp}>
          <WhatsappLogo weight="fill" className="w-4 h-4 mr-1" />
          WhatsApp
        </Button>
        {canEdit && (
          <>
            <Button 
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={isEditing ? onSave : onEdit}
            >
              <PencilSimple className="w-4 h-4 mr-1" />
              {isEditing ? "Salvar" : "Editar"}
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="w-4 h-4 mr-1" />
              Excluir
            </Button>
          </>
        )}
      </div>

      <CollectionRequestDialog
        rncId={rnc.id}
        open={isCollectionDialogOpen}
        onOpenChange={setIsCollectionDialogOpen}
      />

      <RNCDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};