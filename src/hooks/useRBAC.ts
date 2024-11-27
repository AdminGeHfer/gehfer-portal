import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "manager" | "user";

interface RBACConfig {
  quality: UserRole[];
  admin: UserRole[];
  portaria: UserRole[];
}

const moduleAccess: RBACConfig = {
  quality: ["admin", "manager", "user"],
  admin: ["admin"],
  portaria: ["admin", "manager", "user"]
};

export function useRBAC() {
  const { data: userRole } = useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      return profile?.role as UserRole;
    }
  });

  const hasAccess = (module: keyof RBACConfig) => {
    if (!userRole) return false;
    return moduleAccess[module].includes(userRole);
  };

  return {
    role: userRole,
    hasAccess,
    isAdmin: userRole === "admin",
    isManager: userRole === "manager",
    isUser: userRole === "user"
  };
}