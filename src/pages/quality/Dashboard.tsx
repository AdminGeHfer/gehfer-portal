import { KpiCard } from "@/components/dashboard/KpiCard";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClipboardList, Clock, FileCheck2, FileX2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRNCs } from "@/hooks/useRNCs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { rncs, isLoading, getDashboardStats } = useRNCs();
  const stats = getDashboardStats();

  const kpis = [
    {
      title: "Total de RNCs",
      value: stats.total.toString(),
      icon: <ClipboardList className="h-4 w-4" />,
      description: "Total registrado"
    },
    {
      title: "RNCs Abertas",
      value: stats.open.toString(),
      icon: <FileX2 className="h-4 w-4" />,
      description: "Aguardando resolução"
    },
    {
      title: "RNCs Fechadas",
      value: stats.closed.toString(),
      icon: <FileCheck2 className="h-4 w-4" />,
      description: "Resolvidas"
    },
    {
      title: "Tempo Médio",
      value: `${stats.averageResolutionTime} dias`,
      icon: <Clock className="h-4 w-4" />,
      description: "Para resolução"
    }
  ];

  const statusData = [
    { name: 'Abertas', value: stats.open },
    { name: 'Em Progresso', value: stats.inProgress },
    { name: 'Fechadas', value: stats.closed },
  ];

  const departmentData = rncs ? Object.entries(
    rncs.reduce((acc: Record<string, number>, rnc) => {
      acc[rnc.department] = (acc[rnc.department] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })) : [];

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Dashboard de Qualidade" />
      
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-card">
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/apps")}
            >
              Voltar para Apps
            </Button>
          </div>
          <nav className="space-y-1 p-2">
            <Button
              variant="secondary"
              className="w-full justify-start"
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/quality/rnc")}
            >
              RNCs
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-2">Dashboard de Qualidade</h1>
            <p className="text-muted-foreground">Visão geral das RNCs</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {kpis.map((kpi, index) => (
              <KpiCard
                key={index}
                title={kpi.title}
                value={kpi.value}
                description={kpi.description}
                icon={kpi.icon}
              />
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">RNCs por Status</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">RNCs por Departamento</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;