import { Calendar, ChartBar, Database, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const CRMDashboard = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Clientes",
      description: "Gerenciamento completo de clientes",
      icon: Users,
      path: "/app/crm/clientes"
    },
    {
      title: "Agendamentos",
      description: "Controle de agendamentos em Kanban",
      icon: Calendar,
      path: "/app/crm/agendamentos"
    },
    {
      title: "Base de Dados",
      description: "Acesso à base de dados completa",
      icon: Database,
      path: "/app/crm/database"
    },
    {
      title: "Relatórios",
      description: "Análises e relatórios detalhados",
      icon: ChartBar,
      path: "/app/crm/relatorios"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="text-3xl font-bold">Módulo CRM</h1>
        <p className="text-muted-foreground">
          Gerencie seus clientes e agendamentos de forma eficiente
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => (
          <Card 
            key={module.path}
            className="hover:bg-accent cursor-pointer transition-colors"
            onClick={() => navigate(module.path)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {module.title}
              </CardTitle>
              <module.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {module.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CRMDashboard;