import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNCTimeline } from "../RNCTimeline";
import { WorkflowTransition, getStatusLabel } from "@/types/workflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      return data as WorkflowTransition[];
    },
  });

  const events = transitions?.map((transition) => ({
    id: transition.id,
    date: transition.created_at,
    title: "Alteração de Status",
    description: `Status alterado de ${getStatusLabel(transition.from_status || 'open')} para ${getStatusLabel(transition.to_status)}`,
    type: "status" as const,
    userId: transition.created_by,
    comment: transition.notes,
  })) || [];

  if (!transitions?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico do Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Nenhuma transição registrada
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
        <RNCTimeline events={events} />
      </CardContent>
    </Card>
  );
}