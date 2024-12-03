import { Badge } from "@/components/ui/badge";
import { WorkflowStatusEnum } from "@/types/rnc";

interface RNCStatusBadgeProps {
  status: WorkflowStatusEnum;
}

const statusConfig = {
  open: {
    label: "Aberto",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
  },
  analysis: {
    label: "Em Análise",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
  },
  resolution: {
    label: "Em Resolução",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
  },
  solved: {
    label: "Solucionado",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
  },
  closing: {
    label: "Em Fechamento",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
  },
  closed: {
    label: "Encerrado",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
  }
};

export const RNCStatusBadge = ({ status }: RNCStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={`${config.className} animate-fade-in`}>
      {config.label}
    </Badge>
  );
};