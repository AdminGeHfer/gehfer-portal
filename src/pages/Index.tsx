import { KpiCard } from "@/components/dashboard/KpiCard";
import { Navbar } from "@/components/layout/Navbar";
import { AlertCircle, CheckCircle2, Clock, FileWarning } from "lucide-react";

const Index = () => {
  // Mock data - será substituído pela integração com Supabase
  const kpiData = {
    total: 150,
    open: 45,
    closed: 105,
    avgTime: "3.5 dias"
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard de Qualidade</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total de RNCs"
            value={kpiData.total}
            icon={<FileWarning className="h-4 w-4" />}
          />
          <KpiCard
            title="RNCs Abertas"
            value={kpiData.open}
            icon={<AlertCircle className="h-4 w-4" />}
          />
          <KpiCard
            title="RNCs Fechadas"
            value={kpiData.closed}
            icon={<CheckCircle2 className="h-4 w-4" />}
          />
          <KpiCard
            title="Tempo Médio de Resolução"
            value={kpiData.avgTime}
            icon={<Clock className="h-4 w-4" />}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;