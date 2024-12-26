import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface UseAuthReturn {
  user: any;
  profile: any;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: profile, isLoading: profileLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Logout realizado com sucesso");
      navigate("/login");
    } catch (error: any) {
      toast.error("Erro ao fazer logout");
      console.error("Erro no logout:", error);
    }
  };

  return {
    user,
    profile,
    isLoading: userLoading || profileLoading,
    error,
    signOut,
  };
}