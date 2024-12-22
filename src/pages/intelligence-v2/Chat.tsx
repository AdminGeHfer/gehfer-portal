import { Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Erro ao verificar autenticação:", error);
        toast({
          title: "Erro de autenticação",
          description: "Houve um problema ao verificar sua sessão",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      if (!session) {
        toast({
          title: "Acesso Restrito",
          description: "Por favor, faça login para continuar",
        });
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Chat Lobe" 
        subtitle="Interface moderna de chat com IA usando Lobe Chat" 
      />
      
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <div className="flex flex-col space-y-4">
            <div className="p-6 bg-card rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Bem-vindo ao Lobe Chat</h2>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-center text-muted-foreground">
                  Chat em desenvolvimento. Em breve você poderá interagir com nossos agentes de IA.
                </p>
              </div>
            </div>
          </div>
        </Suspense>
      </main>
    </div>
  );
};

export default Chat;