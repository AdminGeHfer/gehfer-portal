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
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['agent-metrics', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('calculate_agent_metrics', { p_agent_id: agentId });

      if (error) throw error;
      return data as MetricData[];
    }
  });

  if (isLoading) {
    return <div>Carregando métricas...</div>;
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};