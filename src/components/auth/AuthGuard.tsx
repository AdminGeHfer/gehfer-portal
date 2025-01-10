import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('User signed out or deleted');
        navigate("/login");
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        if (!session) {
          console.log('Token refresh failed');
          toast.error("Sua sessão expirou. Por favor, faça login novamente.");
          navigate("/login");
          return;
        }
        console.log('Token refreshed successfully');
      }

      setIsLoading(false);
    });

    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          toast.error("Erro ao verificar sessão");
          navigate("/login");
          return;
        }

        if (!session) {
          console.log('No active session found');
          navigate("/login");
          return;
        }

        console.log('Active session found');
      } catch (err) {
        console.error('Unexpected error checking session:', err);
        toast.error("Erro inesperado ao verificar sessão");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}