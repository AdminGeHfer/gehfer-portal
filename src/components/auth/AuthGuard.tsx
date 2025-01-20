import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;

    // Handle auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (!isMounted) return;

      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
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
        if (!isMounted) return;

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error checking session:', sessionError);
          setError(sessionError);
          
          if (retryCount < MAX_RETRIES) {
            console.log(`Retrying session check (${retryCount + 1}/${MAX_RETRIES})...`);
            setRetryCount(prev => prev + 1);
            retryTimeout = setTimeout(checkSession, 2000 * (retryCount + 1)); // Exponential backoff
            return;
          } else {
            toast.error("Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.");
            navigate("/login");
          }
          return;
        }

        // Reset retry count on successful connection
        setRetryCount(0);

        if (!session) {
          console.log('No active session found');
          navigate("/login");
          return;
        }

        console.log('Active session found');
      } catch (err) {
        console.error('Unexpected error checking session:', err);
        if (err instanceof Error) {
          setError(err);
        }
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying after error (${retryCount + 1}/${MAX_RETRIES})...`);
          setRetryCount(prev => prev + 1);
          retryTimeout = setTimeout(checkSession, 2000 * (retryCount + 1));
        } else {
          toast.error("Erro de conexão persistente. Por favor, verifique sua conexão com a internet.");
          navigate("/login");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      subscription.unsubscribe();
    };
  }, [navigate, retryCount]);

  if (error && retryCount < MAX_RETRIES) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Erro de Conexão</h2>
          <p className="text-gray-600">Tentando reconectar ao servidor... ({retryCount + 1}/{MAX_RETRIES})</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}