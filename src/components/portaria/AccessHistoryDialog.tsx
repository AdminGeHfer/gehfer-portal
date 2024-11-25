import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Edit, Scale, Truck as TruckIcon } from "lucide-react";
import { useState } from "react";
import { AccessEditDialog } from "./AccessEditDialog";

interface AccessHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessLog: any;
}

export function AccessHistoryDialog({ open, onOpenChange, accessLog }: AccessHistoryDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Histórico do Acesso</span>
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-120px)]">
            <div className="space-y-6 pr-4">
              {/* Vehicle Information */}
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
              </div>

              <Separator />

              {/* Documents and Photos */}
              {(accessLog.driver_document || accessLog.driver_photo || accessLog.truck_photo) && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Documentos e Fotos</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {accessLog.driver_document && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Documento do Motorista</p>
                          <img 
                            src={accessLog.driver_document} 
                            alt="Documento do Motorista"
                            className="rounded-lg border"
                          />
                        </div>
                      )}
                      {accessLog.driver_photo && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Foto do Motorista</p>
                          <img 
                            src={accessLog.driver_photo} 
                            alt="Foto do Motorista"
                            className="rounded-lg border"
                          />
                        </div>
                      )}
                      {accessLog.truck_photo && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Foto do Caminhão</p>
                          <img 
                            src={accessLog.truck_photo} 
                            alt="Foto do Caminhão"
                            className="rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Times */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Horários
                </h3>
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
              </div>

              <Separator />

              {/* Operation Details */}
              {accessLog.operation && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Detalhes da Operação</h3>
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
                  <Separator />
                </>
              )}

              {/* Notes */}
              <div>
                <p className="text-sm font-medium">Observações</p>
                <p className="text-sm text-muted-foreground">
                  {accessLog.notes || "Nenhuma observação"}
                </p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AccessEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        accessLog={accessLog}
      />
    </>
  );
}