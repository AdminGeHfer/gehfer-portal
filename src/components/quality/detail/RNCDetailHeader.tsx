import { Button } from "@/components/atoms/Button";
import { ArrowLeft, Printer, Trash, WhatsappLogo } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { RNC } from "@/types/rnc";

interface RNCDetailHeaderProps {
  id: string;
  rnc: RNC;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onPrint: () => void;
  onWhatsApp: () => void;
}

export const RNCDetailHeader = ({
  id,
  rnc,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  onPrint,
  onWhatsApp,
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
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
              {rnc.status === "open" ? "Aberto" : rnc.status === "in_progress" ? "Em Andamento" : "Fechado"}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">{rnc.title}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={onWhatsApp}>
            <WhatsappLogo weight="fill" className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
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
        </div>
      </div>
    </div>
  );
};