import { Button } from "@/components/atoms/Button";
import { ArrowLeft, Printer } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { RNC } from "@/types/rnc";
import { WhatsappLogo, Trash, Package } from "@phosphor-icons/react";
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
  onPrint: () => void;
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
  onPrint,
  onWhatsApp,
  onStatusChange,
  onRefresh,
  setIsDeleteDialogOpen,
  isDeleteDialogOpen,
  isDeleting
}: RNCDetailHeaderProps) => {
  const navigate = useNavigate();
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/quality/rnc")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">RNC #{rnc.rnc_number || "Novo"}</h1>
            <RNCStatusBadge status={rnc.workflow_status} />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCollectionDialogOpen(true)}>
            <Package className="mr-2 h-4 w-4" />
            Solicitar Coleta
          </Button>
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