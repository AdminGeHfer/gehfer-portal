import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Permission, UserRole } from "@/types/auth";

const roleHierarchy: Record<UserRole, number> = {
  admin: 4,
  manager: 3,
  analyst: 2,
  user: 1
};

export function useRBAC() {
  const [userRole, setUserRole] = useState<UserRole>("user");
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
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
          .select('role, department')
          .eq('id', user.id)
          .single();

        if (profile?.role) {
          setUserRole(profile.role as UserRole);
          setUserDepartment(profile.department);
        }

        // Fetch user permissions
        const { data: rolePermissions } = await supabase
          .from('role_permissions')
          .select('permissions (name)')
          .eq('role', profile?.role)
          .order('created_at', { ascending: true });

        if (rolePermissions) {
          setPermissions(rolePermissions.map(p => p.permissions.name));
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

  function hasPermission(permission: Permission): boolean {
    return permissions.includes(permission) || userRole === 'admin';
  }

  function canAccessDepartment(department: string): boolean {
    return userRole === 'admin' || userDepartment === department;
  }

  function hasMinimumRole(requiredRole: UserRole): boolean {
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  return {
    role: userRole,
    department: userDepartment,
    loading,
    hasPermission,
    canAccessDepartment,
    hasMinimumRole,
    permissions
  };
}