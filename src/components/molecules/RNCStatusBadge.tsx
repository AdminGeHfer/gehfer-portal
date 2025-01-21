import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { StatusEnum } from "@/types/rnc";

interface RNCStatusBadgeProps {
  status: StatusEnum;
}

export function RNCStatusBadge({ status }: RNCStatusBadgeProps) {
  const getStatusConfig = (status: StatusEnum) => {
    const configs: Record<StatusEnum, { label: string, className: string }> = {
      not_created: {
        label: "Não Criado",
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
      },
      pending: {
        label: "Pendente",
        className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
      },
      canceled: {
        label: "Cancelado",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      },
      collect: {
        label: "Para Coleta",
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      },
      concluded: {
        label: "Solucionado",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      }
    };

    return configs[status] || configs.not_created;
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}