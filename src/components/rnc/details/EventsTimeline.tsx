import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  SquarePen, 
  UserPlus, 
  Package, 
  CircleX, 
  SquareCheck,
  Clock
} from "lucide-react";

export function EventsTimeline() {
  const events = [
    {
      id: 1,
      type: "creation",
      date: new Date(),
      title: "RNC criada",
      description: "RNC criada por João Silva",
      userName: "João Silva"
    },
    {
      id: 2,
      type: "assignment",
      date: new Date(),
      title: "RNC atribuída",
      description: "RNC atribuída para Maria Oliveira",
      userName: "Maria Oliveira"
    },
    {
      id: 3,
      type: "collection",
      date: new Date(),
      title: "RNC coletada",
      description: "RNC foi coletada com sucesso",
      userName: "Pedro Santos"
    },
    {
      id: 4,
      type: "closure",
      date: new Date(),
      title: "RNC fechada",
      description: "RNC fechada - Resolvida",
      userName: "Ana Costa"
    },
    {
      id: 5,
      type: "days_left",
      date: new Date(),
      title: "Dias em aberto",
      description: "15 dias em aberto",
      userName: "Sistema"
    },
    {
      id: 6,
      type: "days_left",
      date: new Date(),
      title: "Dias em aberto",
      description: "16 dias em aberto",
      userName: "Sistema"
    },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case "creation":
        return <SquarePen className="text-blue-500" />;
      case "assignment":
        return <UserPlus className="text-white" />;
      case "collection":
        return <Package style={{ color: "#C08F4F" }} />;
      case "closure_canceled":
        return <CircleX className="text-red-500" />;
      case "closure":
        return <SquareCheck className="text-green-500" />;
      case "days_left":
        return <Clock className="text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex gap-4 pb-8 last:pb-0"
        >
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              {getEventIcon(event.type)}
            </div>
            <div className="flex-1 border-l-2 border-dashed border-gray-200 dark:border-gray-800" />
          </div>
          <div className="flex-1 pt-2">
            <div className="flex items-baseline justify-between">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {event.title}
              </h4>
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {format(event.date, "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </time>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {event.description}
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              por {event.userName}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}