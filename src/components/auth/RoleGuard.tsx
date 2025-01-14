import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useRBAC } from "@/hooks/useRBAC";
import { toast } from "sonner";

interface RoleGuardProps {
  children: ReactNode;
  module: string;
  action?: string;
}

export function RoleGuard({ children, module, action = "read" }: RoleGuardProps) {
  const { hasPermission, loading } = useRBAC();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasPermission(module, action)) {
    toast.error("Você não tem permissão para acessar este recurso");
    return <Navigate to="/apps" replace />;
  }

  return <>{children}</>;
}