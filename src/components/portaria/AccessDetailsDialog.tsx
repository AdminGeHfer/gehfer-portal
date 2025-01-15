import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Scale, Truck as TruckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AccessDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessLog;
}

export function AccessDetailsDialog({ open, onOpenChange, accessLog }: AccessDetailsDialogProps) {
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Acesso</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TruckIcon className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">{accessLog.truck?.plate}</p>
              <p className="text-xs text-muted-foreground">
                Motorista: {accessLog.truck?.driver_name}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Transportadora</p>
              <p className="text-sm text-muted-foreground">
                {accessLog.truck?.transport_company}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Tipo de Operação</p>
              <Badge variant="outline">
                {getOperationTypeText(accessLog.purpose)}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Observações</p>
            <p className="text-sm text-muted-foreground">
              {accessLog.notes || "Nenhuma observação"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Entrada</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(accessLog.entry_time), "dd/MM/yyyy HH:mm", {
                  locale: ptBR,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Saída</p>
              <p className="text-sm text-muted-foreground">
                {accessLog.exit_time
                  ? format(new Date(accessLog.exit_time), "dd/MM/yyyy HH:mm", {
                      locale: ptBR,
                    })
                  : "-"}
              </p>
            </div>
          </div>

          {accessLog.operation?.weights && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Scale className="h-4 w-4" />
                <p className="text-sm font-medium">Pesos</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bruto</p>
                  <p className="text-sm">
                    {accessLog.operation?.weights?.gross || "-"} kg
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tara</p>
                  <p className="text-sm">
                    {accessLog.operation?.weights?.tare || "-"} kg
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Líquido</p>
                  <p className="text-sm">
                    {accessLog.operation?.weights?.net || "-"} kg
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}