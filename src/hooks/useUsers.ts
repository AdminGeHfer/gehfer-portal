import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface User {
  role: string;
  id: string;
  name: string | null;
  email: string | null;
  modules: string[] | null;
  active: boolean | null;
}

const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
};

export function useUsers() {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers
  });

  return {
    ...query,
    refetch: query.refetch
  };
}