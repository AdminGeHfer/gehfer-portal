import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimelineEvent, TimelineEventData } from "./TimelineEvent";

interface TimelineListProps {
  events: TimelineEventData[];
  isLoading?: boolean;
}

export function TimelineList({ events, isLoading }: TimelineListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico do Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Carregando...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!events?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico do Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Nenhum evento registrado
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico do Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {events.map((event) => (
            <div key={event.id} className="relative">
              <TimelineEvent
                event={event}
                userName={event.userName}
              />
              {events.indexOf(event) !== events.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-0.5 -translate-x-1/2 bg-border" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}