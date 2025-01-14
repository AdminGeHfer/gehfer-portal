import React from "react";
import { Card } from "@/components/ui/card";
import { Truck } from "@/types/truck";
import { useDrag } from "react-dnd";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Truck as TruckIcon, Scale, CheckCircle, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { usePortariaTrucks } from "@/hooks/usePortariaTrucks";
import { cn } from "@/lib/utils";

interface TruckCardProps {
  truck: Truck;
  showWeights?: boolean;
}

export function TruckCard({ truck, showWeights = false }: TruckCardProps) {
  const { finishOperation } = usePortariaTrucks();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "truck",
    item: { id: truck.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-500";
      case "in_process":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting":
        return "Aguardando";
      case "in_process":
        return "Em Operação";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Truck":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Carreta":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Bitrem":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "Rodotrem":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

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

  const getWaitTime = (entryTime: string) => {
    const now = new Date();
    const entry = new Date(entryTime);
    const diffInMinutes = Math.floor((now.getTime() - entry.getTime()) / (1000 * 60));
    return diffInMinutes;
  };

  return (
    <Card
      ref={drag}
      className={cn(
        "p-4 cursor-move hover:shadow-md transition-all",
        isDragging && "opacity-50",
        truck.status === "in_process" && "border-blue-500",
        truck.status === "waiting" && "border-yellow-500"
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TruckIcon className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium">{truck.plate}</p>
              <p className="text-xs text-muted-foreground">
                Motorista: {truck.driver}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={`${getStatusColor(truck.status)} text-white`}>
            {getStatusText(truck.status)}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              {getOperationTypeText(truck.operationType || 'loading')}
            </Badge>
            <Badge className={getTypeColor(truck.type)}>{truck.type}</Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Timer className="h-3 w-3" />
            <span>Tempo de espera: {getWaitTime(truck.entryTime)} min</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Transportadora: {truck.transportCompany}
          </p>

          {showWeights && truck.weights && (
            <div className="space-y-1 pt-2">
              <div className="flex items-center gap-1 text-xs">
                <Scale className="h-3 w-3" />
                <span className="text-muted-foreground">Pesos:</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Bruto</p>
                  <p>{truck.weights.gross || '-'} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tara</p>
                  <p>{truck.weights.tare || '-'} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Líquido</p>
                  <p>{truck.weights.net || '-'} kg</p>
                </div>
              </div>
            </div>
          )}

          {truck.notes && (
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Observações: {truck.notes}
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-right">
            {format(new Date(truck.entryTime), "HH:mm", { locale: ptBR })}
          </p>

          {truck.status === "in_process" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => finishOperation(truck.id)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Finalizar Operação
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}