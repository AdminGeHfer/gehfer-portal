// src/components/rnc/details/EventsTimeline.tsx
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

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  created_at: string;
  created_by_profile?: {
    name: string;
  };
}

interface EventsTimelineProps {
  events: Event[];
}

export function EventsTimeline({ events }: EventsTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "creation":
        return <SquarePen className="text-blue-500" />;
      case "assignment":
        return <UserPlus className="text-orange-500" />;
      case "status - collected":
        return <Package style={{ color: "#C08F4F" }} />;
      case "status":
        return <Clock className="text-gray-500" />;
      case "status - canceled":
        return <CircleX className="text-red-500" />;
      case "status - concluded":
        return <SquareCheck className="text-green-500" />;
      default:
        return <Clock className="text-white" />;
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
                {format(new Date(event.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </time>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {event.description}
            </p>
            {event.created_by_profile?.name && (
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                por {event.created_by_profile.name}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
