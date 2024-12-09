import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type UserRole = 'admin' | 'manager' | 'analyst' | 'user';
export type { UserRole as Role };

export type Permission = 
  | 'rnc.create' 
  | 'rnc.edit' 
  | 'rnc.delete' 
  | 'rnc.view'
  | 'rnc.assign'
  | 'user.manage'
  | 'role.manage'
  | string;

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

        // For now, we'll use a simplified permission system
        // Later we can implement the role_permissions table
        const defaultPermissions: Permission[] = [];
        
        if (profile?.role === 'admin') {
          defaultPermissions.push(
            'rnc.create', 'rnc.edit', 'rnc.delete', 'rnc.view', 'rnc.assign',
            'user.manage', 'role.manage'
          );
        } else if (profile?.role === 'manager') {
          defaultPermissions.push('rnc.create', 'rnc.edit', 'rnc.view', 'rnc.assign');
        } else if (profile?.role === 'analyst') {
          defaultPermissions.push('rnc.create', 'rnc.edit', 'rnc.view');
        } else {
          defaultPermissions.push('rnc.view');
        }

        setPermissions(defaultPermissions);

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