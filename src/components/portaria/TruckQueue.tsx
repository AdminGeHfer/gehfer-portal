import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDrop } from "react-dnd";
import { TruckCard } from "./TruckCard";
import { usePortariaTrucks } from "@/hooks/usePortariaTrucks";
import { cn } from "@/lib/utils";

interface TruckQueueProps {
  title: string;
  id: string;
}

export function TruckQueue({ title, id }: TruckQueueProps) {
  const { trucks, moveTruck } = usePortariaTrucks();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "truck",
    drop: (item: { id: string }) => {
      moveTruck(item.id, id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const queueTrucks = trucks.filter((truck) => truck.queue === id);

  return (
    <Card 
      ref={drop} 
      className={cn(
        "transition-all duration-200",
        isOver && "border-primary shadow-lg scale-[1.02]",
        "min-h-[200px]"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <span className="text-sm text-muted-foreground">
          {queueTrucks.length} {queueTrucks.length === 1 ? 'caminhão' : 'caminhões'}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {queueTrucks.map((truck) => (
            <TruckCard key={truck.id} truck={truck} />
          ))}
          {queueTrucks.length === 0 && (
            <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground">
                Arraste um caminhão para esta fila
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}