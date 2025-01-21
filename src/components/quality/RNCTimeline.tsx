import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TimelineList } from "./timeline/TimelineList";
import { TimelineEventType } from "./timeline/TimelineEvent";
import { getWorkflowStatusLabel } from "@/utils/workflow";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RNCTimelineProps {
  rncId: string;
}

export function RNCTimeline({ rncId }: RNCTimelineProps) {
  const { data: events, isLoading } = useQuery({
    queryKey: ['rnc-timeline', rncId],
    queryFn: async () => {
      try {
        // Fetch RNC details for creation and assignment info
        const { data: rnc, error: rncError } = await supabase
          .from('rncs')
          .select(`
            id,
            created_at,
            created_by,
            assigned_at,
            assigned_to,
            assigned_by,
            collected_at,
            closed_at,
            days_left,
            created_by_profile:profiles!rncs_created_by_fkey(name, email),
            assigned_to_profile:profiles!rncs_assigned_to_fkey(name, email),
            assigned_by_profile:profiles!rncs_assigned_by_fkey(name, email)
          `)
          .eq('id', rncId)
          .single();

        if (rncError) throw rncError;

        // Fetch workflow transitions for status changes
        const { data: transitions, error: transitionsError } = await supabase
          .from('rnc_workflow_transitions')
          .select(`
            id,
            created_at,
            from_status,
            to_status,
            notes,
            created_by,
            created_by_profile:profiles(name, email)
          `)
          .eq('rnc_id', rncId)
          .order('created_at', { ascending: true });

        if (transitionsError) throw transitionsError;

        const timelineEvents = [];

        // 1. Creation event
        if (rnc.created_at) {
          timelineEvents.push({
            id: `creation-${rnc.id}`,
            date: rnc.created_at,
            title: "RNC Criada",
            description: `RNC criada por ${rnc.created_by_profile?.name || 'Usuário'}`,
            type: "creation" as TimelineEventType,
            userId: rnc.created_by,
            userName: rnc.created_by_profile?.name,
            userEmail: rnc.created_by_profile?.email
          });
        }

        // 2. Assignment event
        if (rnc.assigned_at) {
          timelineEvents.push({
            id: `assignment-${rnc.id}`,
            date: rnc.assigned_at,
            title: "RNC Atribuída",
            description: `RNC atribuída para ${rnc.assigned_to_profile?.name || 'Usuário'} (${rnc.assigned_to_profile?.email || 'Email não disponível'}) por ${rnc.assigned_by_profile?.name || 'Sistema'}`,
            type: "assignment" as TimelineEventType,
            userId: rnc.assigned_by,
            userName: rnc.assigned_by_profile?.name
          });
        }

        // 3. Status changes
        transitions.forEach(transition => {
          timelineEvents.push({
            id: transition.id,
            date: transition.created_at,
            title: "Alteração de Status",
            description: `Status alterado de ${getWorkflowStatusLabel(transition.from_status)} para ${getWorkflowStatusLabel(transition.to_status)}`,
            type: "status" as TimelineEventType,
            userId: transition.created_by,
            userName: transition.created_by_profile?.name,
            notes: transition.notes
          });
        });

        // 4. Collection event
        if (rnc.collected_at) {
          timelineEvents.push({
            id: `collection-${rnc.id}`,
            date: rnc.collected_at,
            title: "Material Coletado",
            description: "Material foi coletado",
            type: "collection" as TimelineEventType,
            userId: rnc.created_by,
            userName: rnc.created_by_profile?.name
          });
        }

        // 5. Closure event
        if (rnc.closed_at) {
          timelineEvents.push({
            id: `closure-${rnc.id}`,
            date: rnc.closed_at,
            title: "RNC Encerrada",
            description: "RNC foi encerrada",
            type: "closure" as TimelineEventType,
            userId: rnc.created_by,
            userName: rnc.created_by_profile?.name
          });
        }

        // Sort events by date
        return timelineEvents.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      } catch (error) {
        console.error('Error in timeline query:', error);
        throw error;
      }
    },
    retry: 1
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email');
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