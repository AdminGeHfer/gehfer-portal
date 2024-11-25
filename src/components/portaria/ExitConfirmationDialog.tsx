import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface ExitConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessLog: any;
  onConfirm: () => void;
}

export function ExitConfirmationDialog({
  open,
  onOpenChange,
  accessLog,
  onConfirm,
}: ExitConfirmationDialogProps) {
  if (!accessLog) return null;

  const getOperationTypeText = (type: string) => {
    switch (type) {
      case "loading":
        return "Carga";
      case "unloading":
        return "Descarga";
      case "both":
        return "Descarga/Carga";
      default:
        return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Registro de Saída</DialogTitle>
          <DialogDescription>
            Você está prestes a registrar a saída do veículo. Confira os dados abaixo:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Placa</p>
            <p className="text-sm">{accessLog.truck?.plate}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Motorista</p>
            <p className="text-sm">{accessLog.truck?.driver_name}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Transportadora</p>
            <p className="text-sm">{accessLog.truck?.transport_company}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Tipo de Operação</p>
            <Badge variant="outline">
              {getOperationTypeText(accessLog.purpose)}
            </Badge>
          </div>

          <div>
            <p className="text-sm font-medium">Entrada</p>
            <p className="text-sm">
              {format(new Date(accessLog.entry_time), "dd/MM/yyyy HH:mm", {
                locale: ptBR,
              })}
            </p>
          </div>

          {accessLog.notes && (
            <div>
              <p className="text-sm font-medium">Observações</p>
              <p className="text-sm text-muted-foreground">{accessLog.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>
            Confirmar Saída
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}