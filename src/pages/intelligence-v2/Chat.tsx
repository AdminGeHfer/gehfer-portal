import { Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Chat as LobeChat } from "@/components/intelligence/Chat";

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
      
      <main className="flex-1 overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <div className="h-[calc(100vh-4rem)]">
            <LobeChat />
          </div>
        </Suspense>
      </main>
    </div>
  );
};

export default Chat;