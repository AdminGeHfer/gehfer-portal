import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { RncStatusEnum } from "@/types/rnc";

interface StatusBadgeProps {
  status: RncStatusEnum;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: RncStatusEnum) => {
    const configs: Record<RncStatusEnum, { label: string, className: string }> = {
        not_created: {
        label: "Não Criado",
        className: "bg-gray-200 text-gray-700 dark:bg-gray-900 dark:text-gray-200"
      },
      pending: {
        label: "Pendente",
        className: "bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
      },
      collect: {
        label: "Coletado",
        className: "bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
      },
      concluded: {
        label: "Solucionado",
        className: "bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-200"
      },
      canceled: {
        label: "Cancelado",
        className: "bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-200"
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