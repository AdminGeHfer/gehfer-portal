import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNCTimeline } from "../RNCTimeline";
import { format } from "date-fns";

interface RNCWorkflowHistoryProps {
  rncId: string;
}

export function RNCWorkflowHistory({ rncId }: RNCWorkflowHistoryProps) {
  const { data: transitions } = useQuery({
    queryKey: ["workflow-transitions", rncId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rnc_workflow_transitions")
        .select(`
          *,
          created_by_profile:profiles(name)
        `)
        .eq("rnc_id", rncId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const events = transitions?.map((transition) => ({
    id: transition.id,
    date: transition.created_at,
    title: "Alteração de Status",
    description: `Status alterado de ${getStatusLabel(transition.from_status || 'open')} para ${getStatusLabel(transition.to_status)}`,
    type: "status",
    userId: transition.created_by,
    comment: transition.notes,
  })) || [];

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: "Aberto",
      analysis: "Em Análise",
      resolution: "Em Resolução",
      solved: "Solucionado",
      closing: "Em Fechamento",
      closed: "Encerrado"
    };
    return labels[status] || status;
  };

  return <RNCTimeline events={events} />;
}