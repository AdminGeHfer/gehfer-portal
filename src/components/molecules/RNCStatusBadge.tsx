import { Badge } from "@/components/ui/badge";
import { StatusEnum } from "@/types/rnc";

interface RNCStatusBadgeProps {
  status: StatusEnum;
}

export function RNCStatusBadge({ status }: RNCStatusBadgeProps) {
  const getStatusConfig = (status: StatusEnum) => {
    const configs: Record<StatusEnum, { label: string, className: string }> = {
      not_created: {
        label: "Pendente",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      },
      pending: {
        label: "Pendente",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      },
      canceled: {
        label: "Cancelado",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      },
      collect: {
        label: "Coletado",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      },
      concluded: {
        label: "Concluído",
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