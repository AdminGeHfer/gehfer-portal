import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Users, Calendar, ChartBar, Settings } from "lucide-react";

const modules = [
  {
    title: "CRM",
    description: "Gestão completa de clientes e relacionamentos",
    icon: Users,
    path: "/app/crm",
    gradient: "from-blue-500 to-blue-600",
    shadowColor: "shadow-blue-500/20"
  },
  {
    title: "Agenda",
    description: "Controle de agendamentos e compromissos",
    icon: Calendar,
    path: "/app/calendar",
    gradient: "from-emerald-500 to-emerald-600",
    shadowColor: "shadow-emerald-500/20"
  },
  {
    title: "Relatórios",
    description: "Análises e insights do seu negócio",
    icon: ChartBar,
    path: "/app/reports",
    gradient: "from-violet-500 to-violet-600",
    shadowColor: "shadow-violet-500/20"
  },
  {
    title: "Configurações",
    description: "Personalize o sistema conforme sua necessidade",
    icon: Settings,
    path: "/app/settings",
    gradient: "from-amber-500 to-amber-600",
    shadowColor: "shadow-amber-500/20"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(191,155,48,0.15),rgba(255,255,255,0))]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative space-y-12"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            The Four - Sistema de Gestão
          </h1>
          <p className="text-lg text-gray-600">
            Selecione um módulo para começar
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {modules.map((module, index) => (
            <motion.div
              key={module.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card 
                className={`relative p-6 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${module.shadowColor} border-0`}
                onClick={() => navigate(module.path)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-10 group-hover:opacity-15 transition-opacity`} />
                
                <div className="relative space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${module.gradient} text-white`}>
                      <module.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {module.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;