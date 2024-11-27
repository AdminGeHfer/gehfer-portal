import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { useState, useEffect } from "react";

const Apps = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for demo purposes
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const apps = [
    {
      title: "Qualidade",
      description: "Gestão de RNCs e Indicadores",
      route: "/quality/dashboard",
      modules: ["quality"]
    },
    {
      title: "Administração",
      description: "Gestão de Usuários e Configurações",
      route: "/admin/users",
      modules: ["admin"]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 md:p-6 lg:p-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-8 text-primary">Aplicativos</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 text-primary">Aplicativos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TooltipProvider>
            {apps.map((app) => (
              <Tooltip key={app.title}>
                <TooltipTrigger asChild>
                  <Card 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => navigate(app.route)}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{app.title}</CardTitle>
                      <CardDescription>{app.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Acessar</Button>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clique para acessar {app.title}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default Apps;