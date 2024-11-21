import { KpiCard } from "@/components/dashboard/KpiCard";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
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
      
      <div className="container mx-auto py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        <div className="mt-8">
          <Button
            onClick={() => navigate("/quality/rnc")}
            className="w-full md:w-auto"
          >
            Ver Lista de RNCs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;