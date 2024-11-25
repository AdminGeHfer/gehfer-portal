import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "creation" | "update" | "status" | "comment";
  userId: string;
}

interface RNCTimelineProps {
  events: TimelineEvent[];
}

export function RNCTimeline({ events }: RNCTimelineProps) {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name');
      if (error) throw error;
      return data;
    }
  });

  const getEventColor = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "creation":
        return "bg-green-500 dark:bg-green-600";
      case "update":
        return "bg-blue-500 dark:bg-blue-600";
      case "status":
        return "bg-yellow-500 dark:bg-yellow-600";
      case "comment":
        return "bg-gray-500 dark:bg-gray-600";
      default:
        return "bg-gray-500 dark:bg-gray-600";
    }
  };

  const getUserName = (userId: string) => {
    const user = users?.find(u => u.id === userId);
    return user?.name || 'Usuário';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (!events?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo</CardTitle>
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
                  <div className="absolute top-3 left-1/2 h-full w-0.5 -translate-x-1/2 bg-border" />
                )}
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
                    {format(parseISO(event.date), "dd/MM/yyyy HH:mm")}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground mt-1 pl-8">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}