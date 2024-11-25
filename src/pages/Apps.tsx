import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, Users, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const Apps = () => {
  const navigate = useNavigate();

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
            <Card 
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg animate-scale-in glass-morphism"
              onClick={() => navigate("/quality/rnc")}
            >
              <div className="bg-primary/5 p-8 flex justify-center items-center group-hover:bg-primary/10 transition-colors">
                <ClipboardCheck className="h-12 w-12 text-primary" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Qualidade</h3>
                <p className="text-muted-foreground mb-4">Gestão de qualidade e controle de processos</p>
                <div className="flex items-center text-primary hover:underline">
                  Acessar módulo
                </div>
              </div>
            </Card>

            <Card 
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg animate-scale-in glass-morphism"
              onClick={() => navigate("/admin/users")}
            >
              <div className="bg-primary/5 p-8 flex justify-center items-center group-hover:bg-primary/10 transition-colors">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Administração</h3>
                <p className="text-muted-foreground mb-4">Ferramentas para gerenciar sua equipe e recursos</p>
                <div className="flex items-center text-primary hover:underline">
                  Acessar módulo
                </div>
              </div>
            </Card>

            <Card 
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg animate-scale-in glass-morphism"
              onClick={() => navigate("/portaria/filas")}
            >
              <div className="bg-primary/5 p-8 flex justify-center items-center group-hover:bg-primary/10 transition-colors">
                <Truck className="h-12 w-12 text-primary" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Portaria</h3>
                <p className="text-muted-foreground mb-4">Gestão de filas e controle de acesso</p>
                <div className="flex items-center text-primary hover:underline">
                  Acessar módulo
                </div>
              </div>
            </Card>
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