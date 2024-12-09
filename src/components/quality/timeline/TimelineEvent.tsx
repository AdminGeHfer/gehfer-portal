import { TimelineEvent as TimelineEventType } from "@/types/rnc";
import { getWorkflowStatusLabel } from "@/utils/workflow";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimelineEventProps {
  event: TimelineEventType;
  userName?: string;
}

export const TimelineEvent = ({ event, userName }: TimelineEventProps) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "creation":
        return "🆕";
      case "update":
        return "📝";
      case "status":
        return "🔄";
      case "comment":
        return "💬";
      case "assignment":
        return "👤";
      default:
        return "📌";
    }
  };

  const formatDescription = (description: string) => {
    if (event.type === "status") {
      const match = description.match(/de (.*) para (.*)/);
      if (match) {
        const fromStatus = getWorkflowStatusLabel(match[1] as any);
        const toStatus = getWorkflowStatusLabel(match[2] as any);
        return `de ${fromStatus} para ${toStatus}`;
      }
    }
    return description;
  };

  return (
    <div className="flex gap-4 pb-8 last:pb-0">
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xl">
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
            {format(new Date(event.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
          </time>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {formatDescription(event.description)}
        </p>
        {userName && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            por {userName}
          </p>
        )}
        {event.comment && (
          <p className="mt-2 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
            {event.comment}
          </p>
        )}
      </div>
    </div>
  );
};