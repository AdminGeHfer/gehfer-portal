import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Package, Printer, Trash, WhatsappLogo } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RNCAssignButton } from "../RNCAssignButton";
import { RNC } from "@/types/rnc";

interface RNCHeaderProps {
  rnc: RNC;
  canEdit: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onPrint: () => void;
  onWhatsApp: () => void;
  onStatusChange: (status: string) => void;
  onRefresh: () => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  onCollectionRequest: () => void;
}

export function RNCHeader({
  rnc,
  canEdit,
  isEditing,
  onEdit,
  onSave,
  onPrint,
  onWhatsApp,
  onStatusChange,
  onRefresh,
  setIsDeleteDialogOpen,
  onCollectionRequest,
}: RNCHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">RNC #{rnc.rnc_number || "Novo"}</h1>
          <Badge 
            variant={rnc.status === "open" ? "warning" : rnc.status === "in_progress" ? "default" : "success"}
            className="animate-fade-in"
          >
            {rnc.status === "open" ? "Aberto" : rnc.status === "in_progress" ? "Em Andamento" : "Fechado"}
          </Badge>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
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
        
        <div className="flex flex-wrap gap-2">
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
            <WhatsappLogo className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
          
          {canEdit && (
            <>
              <Button 
                variant={isEditing ? "default" : "outline"}
                onClick={isEditing ? onSave : onEdit}
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? "Salvar" : "Editar"}
              </Button>
              
              <Button 
                variant="destructive"
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
}