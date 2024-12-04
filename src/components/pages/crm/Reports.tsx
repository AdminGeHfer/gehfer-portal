import { Card } from "@/components/ui/card";
import { SalesForecast } from "@/components/crm/SalesForecast";

const Reports = () => {
  // Dados simulados para previsão de vendas
  const forecastData = [
    { stage: "Leads", value: 50000, probability: 0.2 },
    { stage: "Em Contato", value: 30000, probability: 0.4 },
    { stage: "Proposta Enviada", value: 20000, probability: 0.6 },
    { stage: "Em Negociação", value: 15000, probability: 0.8 },
    { stage: "Fechado", value: 10000, probability: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Acompanhe os principais indicadores do seu negócio
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <SalesForecast data={forecastData} />
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Mais relatórios em breve...</h2>
          <p className="text-muted-foreground">
            Estamos trabalhando para trazer mais insights sobre seu negócio.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Reports;