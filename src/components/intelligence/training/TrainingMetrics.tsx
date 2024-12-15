import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TrainingMetricsProps {
  agentId: string;
}

export const TrainingMetrics = ({ agentId }: TrainingMetricsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Score Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Respostas Avaliadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Melhoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              +15%
            </div>
            <p className="text-xs text-muted-foreground">
              Em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Categoria</CardTitle>
          <CardDescription>
            Performance do agente em diferentes áreas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Técnico", value: 92 },
              { label: "Comercial", value: 78 },
              { label: "Atendimento", value: 88 },
              { label: "Produto", value: 85 },
            ].map((category) => (
              <div key={category.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">
                    {category.label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {category.value}%
                  </span>
                </div>
                <Progress value={category.value} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};