import * as React from "react";
import { Button } from "@/components/ui/button";
import { Package, FilePdf, WhatsappLogo, Trash, PencilSimple } from "@phosphor-icons/react";
import { RNC } from "@/types/rnc";
import { RNCStatusBadge } from "@/components/molecules/RNCStatusBadge";
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
  onEdit,
  onSave,
  onDelete,
  onGeneratePDF,
  onWhatsApp,
  canEdit,
  setIsDeleteDialogOpen,
  isDeleteDialogOpen,
  isDeleting
}: RNCDetailHeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" weight="duotone" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              RNC #{rnc.rnc_number || "Novo"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Criado em {new Date(rnc.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <RNCStatusBadge status={rnc.workflow_status} />
          <div className="flex gap-2">
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
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <RNCDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};