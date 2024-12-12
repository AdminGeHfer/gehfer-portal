import { motion } from "framer-motion";
import { Brain, MessageSquare, Settings, Building2, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { DocumentUpload } from "@/components/intelligence/DocumentUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AIModule {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  isHighlighted?: boolean;
  category: 'core' | 'department' | 'tool';
}

const aiModules: AIModule[] = [
  {
    title: "Hub IA",
    description: "Central de assistentes virtuais inteligentes",
    icon: <Brain className="h-12 w-12 text-primary" />,
    route: "/intelligence/hub",
    category: 'core',
    isHighlighted: true
  },
  {
    title: "Setores",
    description: "Assistentes especializados por departamento",
    icon: <Building2 className="h-12 w-12 text-primary" />,
    route: "/intelligence/sectors",
    category: 'department'
  },
  {
    title: "Chat",
    description: "Interface unificada de conversação",
    icon: <MessageSquare className="h-12 w-12 text-primary" />,
    route: "/intelligence/chat",
    category: 'tool'
  },
  {
    title: "Configurações",
    description: "Gerenciamento e personalização do sistema",
    icon: <Settings className="h-12 w-12 text-primary" />,
    route: "/intelligence/settings",
    category: 'core'
  }
];

const Hub = () => {
  const navigate = useNavigate();

  const groupedModules = aiModules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, AIModule[]>);

  const categoryTitles = {
    core: "Módulos Principais",
    department: "Assistentes por Setor",
    tool: "Ferramentas"
  };

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
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Bem-vindo ao GeHfer Intelligence
                </h2>
                <p className="text-muted-foreground">
                  Acesse nossos assistentes virtuais especializados e otimize seus processos
                </p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Base de Conhecimento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload de Documentos</DialogTitle>
                  </DialogHeader>
                  <DocumentUpload />
                </DialogContent>
              </Dialog>
            </div>

            {Object.entries(groupedModules).map(([category, modules]) => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-medium mb-4 text-foreground/80">
                  {categoryTitles[category as keyof typeof categoryTitles]}
                </h3>
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
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Hub;