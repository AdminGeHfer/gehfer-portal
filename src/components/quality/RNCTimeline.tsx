import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimelineList } from "./timeline/TimelineList";
import { TimelineEventType } from "./timeline/TimelineEvent";
import { getWorkflowStatusLabel } from "@/utils/workflow";

interface RNCTimelineProps {
  rncId: string;
}

export function RNCTimeline({ rncId }: RNCTimelineProps) {
  const { data: events, isLoading } = useQuery({
    queryKey: ['rnc-timeline', rncId],
    queryFn: async () => {
      // Fetch basic events
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

      // Fetch workflow transitions
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

      // Combine events and transitions
      const allEvents = [
        ...basicEvents.map(event => ({
          id: event.id,
          date: event.created_at,
          title: event.title,
          description: event.description,
          type: event.type as TimelineEventType,
          userId: event.created_by,
          userName: event.created_by_profile?.name
        })),
        ...transitions.map(transition => ({
          id: transition.id,
          date: transition.created_at,
          title: "Alteração de Status",
          description: `Status alterado de ${getWorkflowStatusLabel(transition.from_status)} para ${getWorkflowStatusLabel(transition.to_status)}`,
          type: "status" as TimelineEventType,
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

  return (
    <TimelineList
      events={events || []}
      isLoading={isLoading}
      getUserName={getUserName}
      getInitials={getInitials}
    />
  );
}