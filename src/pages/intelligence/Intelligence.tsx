import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { Brain, MessageSquare, Settings, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const modules = [
  {
    title: "Hub IA",
    description: "Central de assistentes virtuais inteligentes",
    icon: <Brain className="h-12 w-12 text-primary" />,
    route: "/intelligence/hub",
    primary: true
  },
  {
    title: "Setores",
    description: "Assistentes especializados por departamento",
    icon: <Building2 className="h-12 w-12 text-primary" />,
    route: "/intelligence/sectors"
  },
  {
    title: "Chat",
    description: "Interface unificada de conversação",
    icon: <MessageSquare className="h-12 w-12 text-primary" />,
    route: "/intelligence/chat"
  },
  {
    title: "Configurações",
    description: "Gerenciamento e personalização do sistema",
    icon: <Settings className="h-12 w-12 text-primary" />,
    route: "/intelligence/settings"
  }
];

const ModuleCard = ({ title, description, icon, route, primary = false }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className={`group cursor-pointer overflow-hidden transition-all hover:shadow-lg animate-scale-in ${
        primary ? 'col-span-2 md:col-span-2' : ''
      }`}
      onClick={() => navigate(route)}
    >
      <div className="bg-primary/5 p-8 flex justify-center items-center group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center text-primary hover:underline">
          Acessar módulo
        </div>
      </div>
    </Card>
  );
};

const Intelligence = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header title="GeHfer Intelligence" subtitle="Central de Inteligência Artificial" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold mb-2">Bem-vindo ao GeHfer Intelligence</h2>
            <p className="text-muted-foreground">
              Acesse nossos assistentes virtuais especializados e otimize seus processos
            </p>
          </motion.div>
        
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {modules.map((module, index) => (
              <ModuleCard 
                key={index}
                title={module.title}
                description={module.description}
                icon={module.icon}
                route={module.route}
                primary={module.primary}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Intelligence;