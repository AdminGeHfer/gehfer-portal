import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function EventsTimeline() {
  const events = [
    {
      id: 1,
      type: "creation",
      date: new Date(),
      description: "RNC criada por João Silva",
    },
    {
      id: 2,
      type: "assignment",
      date: new Date(),
      description: "RNC atribuída para Maria Oliveira",
    },
    {
      id: 3,
      type: "collection",
      date: new Date(),
      description: "RNC coletada",
    },
    {
      id: 4,
      type: "closure",
      date: new Date(),
      description: "RNC fechada - Resolvida",
    },
    {
      id: 5,
      type: "days_left",
      date: new Date(),
      description: "15 dias em aberto",
    },
    {
      id: 6,
      type: "days_left",
      date: new Date(),
      description: "16 dias em aberto",
    },
  ];

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex gap-4 border-l-2 border-primary pl-4 pb-4 last:pb-0"
        >
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
              <time className="text-xs text-muted-foreground">
                {format(event.date, "dd/MM/yyyy", { locale: ptBR })}
              </time>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}