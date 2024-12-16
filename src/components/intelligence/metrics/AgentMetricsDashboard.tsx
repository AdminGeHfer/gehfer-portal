import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface MetricData {
  metric_type: string;
  avg_value: number;
  total_count: number;
}

interface AgentMetricsDashboardProps {
  agentId: string;
}

export const AgentMetricsDashboard = ({ agentId }: AgentMetricsDashboardProps) => {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['agent-metrics', agentId],
    queryFn: async () => {
      if (!agentId) {
        console.log('No agent ID provided for metrics');
        return null;
      }

      const { data, error } = await supabase
        .rpc('calculate_agent_metrics', { p_agent_id: agentId });

      if (error) {
        console.error('Error fetching agent metrics:', error);
        throw error;
      }
      return data as MetricData[];
    },
    enabled: !!agentId // Only run query if agentId exists
  });

  if (!agentId) {
    return null; // Don't render anything if no agentId
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive p-4">
        Erro ao carregar métricas do agente
      </div>
    );
  }

  const feedbackMetrics = metrics?.find(m => m.metric_type === 'feedback_rating');
  const avgRating = feedbackMetrics?.avg_value || 0;
  const totalFeedbacks = feedbackMetrics?.total_count || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Avaliação Média</CardTitle>
          <CardDescription>Baseado em feedback dos usuários</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgRating.toFixed(1)}/5.0</div>
          <p className="text-xs text-muted-foreground">
            Baseado em {totalFeedbacks} avaliações
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Histórico de Avaliações</CardTitle>
          <CardDescription>Últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            {metrics && metrics.length > 0 ? (
              <ChartContainer
                config={{
                  rating: {
                    label: "Avaliação",
                    color: "hsl(var(--primary))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 5]} />
                    <ChartTooltip />
                    <Line
                      type="monotone"
                      dataKey="avg_value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};