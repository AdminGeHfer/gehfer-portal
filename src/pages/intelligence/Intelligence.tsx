import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { Brain, MessageSquare, Settings, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  route: string;
  isHighlighted?: boolean;
}

const modules = [
  {
    title: "Hub IA",
    description: "Central de assistentes virtuais inteligentes",
    icon: <Brain className="h-12 w-12 text-primary" />,
    route: "/intelligence/hub",
    isHighlighted: true
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

const Intelligence = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="GeHfer Intelligence" 
        subtitle="Central de Inteligência Artificial" 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Bem-vindo ao GeHfer Intelligence
            </h2>
            <p className="text-muted-foreground">
              Acesse nossos assistentes virtuais especializados e otimize seus processos
            </p>
          </motion.div>
        
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className={`group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20 backdrop-blur-sm bg-card/50 border-primary/20 ${
                    module.isHighlighted ? 'col-span-2 md:col-span-2 ring-2 ring-primary/50' : ''
                  }`}
                  onClick={() => navigate(module.route)}
                >
                  <div className="bg-primary/5 p-8 flex justify-center items-center group-hover:bg-primary/10 transition-colors">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {module.icon}
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                      {module.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{module.description}</p>
                    <Button
                      variant="ghost"
                      className="w-full justify-start group-hover:text-primary transition-colors"
                    >
                      Acessar módulo
                      <motion.span
                        className="ml-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                      >
                        →
                      </motion.span>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Intelligence;