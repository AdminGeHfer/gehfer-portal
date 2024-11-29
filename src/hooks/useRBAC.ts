import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Role = "admin" | "manager" | "user";

interface Permission {
  module: string;
  actions: string[];
}

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    { module: "any", actions: ["read", "write", "delete"] },
    { module: "quality", actions: ["read", "write", "delete"] },
    { module: "admin", actions: ["read", "write", "delete"] },
    { module: "portaria", actions: ["read", "write", "delete"] }
  ],
  manager: [
    { module: "quality", actions: ["read", "write"] },
    { module: "portaria", actions: ["read", "write"] }
  ],
  user: [
    { module: "quality", actions: ["read"] },
    { module: "portaria", actions: ["read"] }
  ]
};

export function useRBAC() {
  const [userRole, setUserRole] = useState<Role>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role && isValidRole(profile.role)) {
          setUserRole(profile.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        toast.error("Erro ao carregar permissões do usuário");
      } finally {
        setLoading(false);
      }
    }

    getUserRole();
  }, []);

  function isValidRole(role: string): role is Role {
    return ["admin", "manager", "user"].includes(role);
  }

  function hasPermission(module: string, action: string): boolean {
    // Admin has access to everything
    if (userRole === "admin") return true;
    
    // Special case for "any" module
    if (module === "any") return true;

    const permissions = rolePermissions[userRole];
    const modulePermissions = permissions.find(p => p.module === module);
    return !!modulePermissions?.actions.includes(action);
  }

  function canAccessModule(module: string): boolean {
    return rolePermissions[userRole].some(p => p.module === module);
  }

  return {
    role: userRole,
    loading,
    hasPermission,
    canAccessModule,
    isAdmin: userRole === "admin",
    isManager: userRole === "manager"
  };
}