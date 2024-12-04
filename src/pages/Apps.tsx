import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, Users, Truck, Package, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

const modules = [
  {
    title: "Qualidade",
    description: "Gestão de qualidade e controle de processos",
    icon: <ClipboardCheck className="h-12 w-12 text-primary" />,
    route: "/quality/rnc",
    submodules: [
      { title: "RNCs", route: "/quality/rnc", icon: <ClipboardCheck className="h-4 w-4" /> },
      { title: "Workflow", route: "/quality/workflow", icon: <GitBranch className="h-4 w-4" /> }
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

const ModuleCard = ({ title, description, icon, route, submodules }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg animate-scale-in glass-morphism"
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

const Apps = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-2">Selecione um módulo para começar</h2>
            <p className="text-muted-foreground mb-8">Acesse as ferramentas e recursos disponíveis</p>
          </div>
        
          <div className="grid gap-6 md:grid-cols-3">
            {modules.map((module, index) => (
              <ModuleCard 
                key={index}
                title={module.title}
                description={module.description}
                icon={module.icon}
                route={module.route}
                submodules={module.submodules}
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

export default Apps;