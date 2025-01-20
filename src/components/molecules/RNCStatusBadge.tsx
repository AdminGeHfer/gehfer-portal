import * as React from "react";
import { Badge } from "@/components/ui/badge";

interface RNCStatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  not_created: {
    label: "Não Criado",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  },
  canceled: {
    label: "Cancelado",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  },
  pending: {
    label: "Pendente",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
  },
  concluded: {
    label: "Concluído",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
  },
  collect: {
    label: "Em Coleta",
    className: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-400"
  }
};

export const RNCStatusBadge = ({ status }: RNCStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.not_created;
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.className} animate-fade-in font-medium px-3 py-1 rounded-full border-none`}
    >
      {config.label}
    </Badge>
  );
};