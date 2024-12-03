import { Button } from "@/components/atoms/Button";
import { ArrowLeft, Printer } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { RNC } from "@/types/rnc";
import { WhatsappLogo, Trash, Package } from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RNCAssignButton } from "./RNCAssignButton";
import { getStatusLabel } from "@/types/workflow";

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
  onCollectionRequest: () => void;
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
  onCollectionRequest,
}: RNCDetailHeaderProps) => {
  const navigate = useNavigate();

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
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              rnc.workflow_status === "open" 
                ? "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                : rnc.workflow_status === "analysis" || rnc.workflow_status === "resolution"
                ? "bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                : "bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-200"
            }`}>
              {getStatusLabel(rnc.workflow_status)}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {canEdit && (
            <Select defaultValue={rnc.workflow_status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Alterar Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="closed">Fechado</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" onClick={onCollectionRequest}>
            <Package className="mr-2 h-4 w-4" />
            Solicitar Coleta
          </Button>
          <Button variant="outline" onClick={onPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <RNCAssignButton
            rncId={rnc.id}
            currentAssignee={rnc.assignedTo}
            onAssigned={onRefresh}
          />
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
    </div>
  );
};
