import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  name: string;
  email: string;
  modules: string[];
  active: boolean;
}

// TODO: Replace with actual API call
const fetchUsers = async (): Promise<User[]> => {
  // Simulated API response
  return [
    {
      id: "1",
      name: "João Silva",
      email: "joao@example.com",
      modules: ["quality", "admin"],
      active: true
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@example.com",
      modules: ["quality"],
      active: true
    }
  ];
};

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers
  });
}