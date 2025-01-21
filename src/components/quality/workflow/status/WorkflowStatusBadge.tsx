import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { WorkflowStatusEnum } from "@/types/rnc";

interface WorkflowStatusBadgeProps {
  status: WorkflowStatusEnum;
}

export function WorkflowStatusBadge({ status }: WorkflowStatusBadgeProps) {
  const getStatusConfig = (status: WorkflowStatusEnum) => {
    const configs: Record<WorkflowStatusEnum, { label: string, className: string }> = {
      open: {
        label: "Aberto",
        className: "bg-[#F2FCE2] text-green-800 dark:bg-green-900 dark:text-green-100"
      },
      analysis: {
        label: "Em Análise",
        className: "bg-[#FEC6A1] text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      },
      resolution: {
        label: "Em Resolução",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      },
      solved: {
        label: "Resolvido",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      },
      closing: {
        label: "Fechando",
        className: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100"
      },
      closed: {
        label: "Fechado",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      }
    };

    return configs[status] || configs.open;
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}