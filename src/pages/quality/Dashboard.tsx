import React from 'react';
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Clock, FileCheck2, FileX2, Sun, Moon, LogOut } from "lucide-react";
import { useRNCs } from "@/hooks/useRNCs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const { rncs, isLoading, getDashboardStats } = useRNCs();
  const stats = getDashboardStats();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso");
      navigate("/login");
    } catch {
      toast.error("Erro ao fazer logout");
    }
  };

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
      <div className="flex h-16 items-center justify-between px-6 border-b">
        <h1 className="text-2xl font-semibold">Dashboard de Qualidade</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={signOut}
            className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <main className="flex-1 p-6">
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
  );
};

export default Dashboard;