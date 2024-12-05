import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare, UserCheck, Clock, AlertCircle } from "lucide-react";

export type TimelineEventType = "creation" | "update" | "status" | "comment" | "assignment";

export interface TimelineEventData {
  id: string;
  date: string;
  title: string;
  description: string;
  type: TimelineEventType;
  userId: string;
  userName?: string;
  notes?: string;
  comment?: string;
}

interface TimelineEventProps {
  event: TimelineEventData;
  getInitials: (name: string) => string;
  getUserName: (userId: string) => string;
}

export function TimelineEvent({ event, getInitials, getUserName }: TimelineEventProps) {
  const getEventIcon = (type: TimelineEventType) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      case "assignment":
        return <UserCheck className="h-4 w-4" />;
      case "status":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: TimelineEventType) => {
    switch (type) {
      case "creation":
        return "bg-green-500 dark:bg-green-600";
      case "update":
        return "bg-blue-500 dark:bg-blue-600";
      case "status":
        return "bg-yellow-500 dark:bg-yellow-600";
      case "comment":
        return "bg-purple-500 dark:bg-purple-600";
      case "assignment":
        return "bg-orange-500 dark:bg-orange-600";
      default:
        return "bg-gray-500 dark:bg-gray-600";
    }
  };

  return (
    <div className="flex gap-4">
      <div className="relative flex items-center justify-center">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${getEventColor(event.type)}`}
        >
          {getEventIcon(event.type)}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {getInitials(getUserName(event.userId))}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                por {getUserName(event.userId)}
              </p>
            </div>
          </div>
          <time className="text-xs text-muted-foreground">
            {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </time>
        </div>
        <div className="pl-8">
          <p className="text-sm text-muted-foreground mt-1">
            {event.description}
          </p>
          {(event.notes || event.comment) && (
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <p className="text-sm">{event.notes || event.comment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}