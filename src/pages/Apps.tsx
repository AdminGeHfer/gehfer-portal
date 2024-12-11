import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, Users, Truck, Package, Brain, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  route: string;
  submodules?: {
    title: string;
    route: string;
    icon: React.ReactElement;
  }[];
  isHighlighted?: boolean;
}

const ModuleCard = ({ title, description, icon, route, submodules, isHighlighted }: ModuleCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className={`group cursor-pointer overflow-hidden transition-all hover:shadow-lg animate-scale-in glass-morphism ${
        isHighlighted ? 'col-span-2 md:col-span-2' : ''
      }`}
      onClick={() => navigate(route)}
    >
      <div className="bg-primary/5 p-8 flex justify-center items-center group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-col gap-2">
          {submodules ? (
            submodules.map((submodule, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(submodule.route);
                }}
              >
                {submodule.icon}
                <span className="ml-2">{submodule.title}</span>
              </Button>
            ))
          ) : (
            <div className="flex items-center text-primary hover:underline">
              Acessar módulo
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const modules = [
  {
    title: "GeHfer Intelligence",
    description: "Central de Inteligência Artificial e Assistentes Virtuais",
    icon: <Brain className="h-12 w-12 text-primary" />,
    route: "/intelligence",
    isHighlighted: true
  },
  {
    title: "Qualidade",
    description: "Gestão de qualidade e controle de processos",
    icon: <ClipboardCheck className="h-12 w-12 text-primary" />,
    route: "/quality/rnc",
    submodules: [
      { title: "RNCs", route: "/quality/rnc", icon: <ClipboardCheck className="h-4 w-4" /> }
    ]
  },
  {
    title: "Administração",
    description: "Ferramentas para gerenciar sua equipe e recursos",
    icon: <Users className="h-12 w-12 text-primary" />,
    route: "/admin/users"
  },
  {
    title: "Portaria",
    description: "Gestão de filas e controle de acesso",
    icon: <Truck className="h-12 w-12 text-primary" />,
    route: "/portaria/acesso"
  },
  {
    title: "Cadastros",
    description: "Gerenciamento de produtos e outros cadastros",
    icon: <Package className="h-12 w-12 text-primary" />,
    route: "/admin/products"
  }
];

const Apps = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso");
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl font-semibold">Portal GeHfer</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold mb-2">Selecione um módulo para começar</h2>
            <p className="text-muted-foreground">
              Acesse as ferramentas e recursos disponíveis
            </p>
          </motion.div>
        
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <ModuleCard 
                key={index}
                title={module.title}
                description={module.description}
                icon={module.icon}
                route={module.route}
                submodules={module.submodules}
                primary={module.primary}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="container mx-auto flex justify-between items-center text-sm text-muted-foreground">
          <span>© 2024 GeHfer. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm">Sobre</Button>
            <Button variant="ghost" size="sm">Ajuda</Button>
            <span>v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
