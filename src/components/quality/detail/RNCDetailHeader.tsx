import { Button } from "@/components/atoms/Button";
import { ArrowLeft, Printer } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { RNC } from "@/types/rnc";
import { WhatsappLogo, Trash } from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RNCDetailHeaderProps {
  id: string;
  rnc: RNC;
  isEditing: boolean;
  canEdit: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onPrint: () => void;
  onWhatsApp: () => void;
  onStatusChange: (status: string) => void;
}

export const RNCDetailHeader = ({
  id,
  rnc,
  isEditing,
  canEdit,
  onEdit,
  onSave,
  onDelete,
  onPrint,
  onWhatsApp,
  onStatusChange,
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
            <h1 className="text-2xl font-semibold">RNC #{id}</h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              rnc.status === "open" 
                ? "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                : rnc.status === "in_progress"
                ? "bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                : "bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-200"
            }`}>
              {rnc.status === "open" ? "Aberto" : rnc.status === "in_progress" ? "Em Andamento" : "Fechado"}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {canEdit && (
            <Select defaultValue={rnc.status} onValueChange={onStatusChange}>
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
                onClick={onDelete}
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