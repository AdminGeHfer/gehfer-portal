import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "creation" | "update" | "status" | "comment";
}

interface RNCTimelineProps {
  events: TimelineEvent[];
}

export function RNCTimeline({ events }: RNCTimelineProps) {
  const getEventColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "creation":
        return "bg-green-500";
      case "update":
        return "bg-blue-500";
      case "status":
        return "bg-yellow-500";
      case "comment":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linha do Tempo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="relative flex items-center justify-center">
                <div
                  className={cn(
                    "h-3 w-3 rounded-full",
                    getEventColor(event.type)
                  )}
                />
                {index !== events.length - 1 && (
                  <div className="absolute top-3 left-1/2 h-full w-0.5 -translate-x-1/2 bg-gray-200" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{event.title}</p>
                  <time className="text-xs text-gray-500">{event.date}</time>
                </div>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}