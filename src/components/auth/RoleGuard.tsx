import { Navigate } from "react-router-dom";
import { useRBAC, UserRole } from "@/hooks/useRBAC";
import { toast } from "sonner";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  module?: "quality" | "admin" | "portaria";
}

export function RoleGuard({ children, allowedRoles, module }: RoleGuardProps) {
  const { role, hasAccess } = useRBAC();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (module && !hasAccess(module)) {
    toast.error("Você não tem permissão para acessar este módulo");
    return <Navigate to="/apps" replace />;
  }

  if (!allowedRoles.includes(role)) {
    toast.error("Você não tem permissão para acessar esta página");
    return <Navigate to="/apps" replace />;
  }

  return <>{children}</>;
}