import { KpiCard } from "@/components/dashboard/KpiCard";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClipboardList, Clock, FileCheck2, FileX2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const kpis = [
    {
      title: "Total de RNCs",
      value: "12",
      icon: <ClipboardList className="h-4 w-4" />,
      description: "Últimos 30 dias"
    },
    {
      title: "RNCs Abertas",
      value: "5",
      icon: <FileX2 className="h-4 w-4" />,
      description: "Aguardando resolução"
    },
    {
      title: "RNCs Fechadas",
      value: "7",
      icon: <FileCheck2 className="h-4 w-4" />,
      description: "Resolvidas"
    },
    {
      title: "Tempo Médio",
      value: "3.2 dias",
      icon: <Clock className="h-4 w-4" />,
      description: "Para resolução"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard de Qualidade" />
      
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-white">
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
            <p className="text-gray-500">Visão geral das RNCs</p>
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
              {/* TODO: Add chart component */}
            </Card>
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">RNCs por Tipo</h2>
              {/* TODO: Add chart component */}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;