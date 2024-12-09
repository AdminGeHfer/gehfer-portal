import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useRBAC } from "@/hooks/useRBAC";
import { Permission, UserRole } from "@/types/auth";
import { toast } from "sonner";

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: Permission;
  department?: string;
}

export function RoleGuard({ 
  children, 
  requiredRole, 
  requiredPermission,
  department 
}: RoleGuardProps) {
  const { 
    hasMinimumRole, 
    hasPermission, 
    canAccessDepartment,
    loading 
  } = useRBAC();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasAccess = (
    (!requiredRole || hasMinimumRole(requiredRole)) &&
    (!requiredPermission || hasPermission(requiredPermission)) &&
    (!department || canAccessDepartment(department))
  );

  if (!hasAccess) {
    toast.error("Você não tem permissão para acessar este recurso");
    return <Navigate to="/apps" replace />;
  }

  return <>{children}</>;
}