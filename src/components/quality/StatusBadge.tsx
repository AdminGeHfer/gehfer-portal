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
        className: "bg-amber-200 text-amber-700 dark:bg-amber-900 dark:text-amber-200"
      },
      collect: {
        label: "Coletado",
        className: "bg-teal-200 text-teal-700 dark:bg-teal-900 dark:text-teal-200"
      },
      concluded: {
        label: "Solucionado",
        className: "bg-emerald-200 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
      },
      canceled: {
        label: "Cancelado",
        className: "bg-rose-200 text-rose-700 dark:bg-rose-900 dark:text-rose-200"
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