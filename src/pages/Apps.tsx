import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Settings } from "lucide-react";

const Apps = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-heading font-bold text-primary">GeHfer Portal</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Módulos Disponíveis</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Qualidade</CardTitle>
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <CardDescription>
                Gestão de RNCs e indicadores de qualidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Acesse o módulo de qualidade para gerenciar RNCs e acompanhar indicadores
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/admin")}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Administração</CardTitle>
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <CardDescription>
                Configurações e administração do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gerencie usuários, permissões e configurações do sistema
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Apps;