import { motion } from "framer-motion";
import { MessageSquare, Settings, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";

const modules = [
  {
    title: "Chat Lobe",
    description: "Interface moderna de chat com IA usando Lobe Chat",
    icon: <MessageSquare className="h-12 w-12 text-primary" />,
    route: "/intelligence-v2/chat",
    category: 'core'
  },
  {
    title: "Configurações",
    description: "Personalização e configuração do ambiente",
    icon: <Settings className="h-12 w-12 text-primary" />,
    route: "/intelligence-v2/settings",
    category: 'core'
  }
];

const Hub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="GeHfer Intelligence V2" 
        subtitle="Nova geração de IA com Lobe Chat" 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Beta Version</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Bem-vindo ao Intelligence V2</h2>
          <p className="text-muted-foreground">
            Experimente nossa nova interface de IA powered by Lobe Chat
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {modules.map((module, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20 backdrop-blur-sm bg-card/50 border-primary/20"
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
      </main>
    </div>
  );
};

export default Hub;