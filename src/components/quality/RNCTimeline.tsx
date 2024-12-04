import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, UserCheck, Clock, AlertCircle } from "lucide-react";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "creation" | "update" | "status" | "comment" | "assignment";
  userId: string;
  comment?: string;
  notes?: string;
}

interface RNCTimelineProps {
  rncId: string;
}

export function RNCTimeline({ rncId }: RNCTimelineProps) {
  const { data: events, isLoading } = useQuery({
    queryKey: ['rnc-timeline', rncId],
    queryFn: async () => {
      // Buscar eventos básicos
      const { data: basicEvents, error: eventsError } = await supabase
        .from('rnc_events')
        .select(`
          id,
          created_at,
          title,
          description,
          type,
          created_by,
          created_by_profile:profiles(name)
        `)
        .eq('rnc_id', rncId)
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      // Buscar transições de workflow
      const { data: transitions, error: transitionsError } = await supabase
        .from('rnc_workflow_transitions')
        .select(`
          id,
          created_at,
          from_status,
          to_status,
          notes,
          created_by,
          created_by_profile:profiles(name)
        `)
        .eq('rnc_id', rncId)
        .order('created_at', { ascending: false });

      if (transitionsError) throw transitionsError;

      // Combinar eventos e transições
      const allEvents = [
        ...basicEvents.map(event => ({
          id: event.id,
          date: event.created_at,
          title: event.title,
          description: event.description,
          type: event.type,
          userId: event.created_by,
          userName: event.created_by_profile?.name
        })),
        ...transitions.map(transition => ({
          id: transition.id,
          date: transition.created_at,
          title: "Alteração de Status",
          description: `Status alterado de ${transition.from_status || 'Aberto'} para ${transition.to_status}`,
          type: "status" as const,
          userId: transition.created_by,
          userName: transition.created_by_profile?.name,
          notes: transition.notes
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return allEvents;
    }
  });

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

  const getEventIcon = (type: TimelineEvent["type"]) => {
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

  const getEventColor = (type: TimelineEvent["type"]) => {
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
          {events.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="relative flex items-center justify-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${getEventColor(event.type)}`}
                >
                  {getEventIcon(event.type)}
                </div>
                {index !== events.length - 1 && (
                  <div className="absolute top-8 left-1/2 h-full w-0.5 -translate-x-1/2 bg-border" />
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}