import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SalesForecastProps {
  data: {
    stage: string;
    value: number;
    probability: number;
  }[];
}

export const SalesForecast = ({ data }: SalesForecastProps) => {
  const totalForecast = data.reduce((acc, curr) => acc + (curr.value * curr.probability), 0);
  
  const chartData = data.map(item => ({
    name: item.stage,
    valor: item.value,
    previsao: item.value * item.probability,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Previsão de Vendas</span>
          <span className="text-primary">
            R$ {totalForecast.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#8E9196" name="Valor Total" />
              <Line type="monotone" dataKey="previsao" stroke="#BF9B30" name="Previsão" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};