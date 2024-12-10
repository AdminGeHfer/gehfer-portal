import { Badge } from "@/components/ui/badge";
import { WorkflowStatusEnum } from "@/types/rnc";

interface RNCStatusBadgeProps {
  status: WorkflowStatusEnum;
}

const statusConfig = {
  open: {
    label: "Aberto",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100 border-yellow-200 dark:border-yellow-800"
  },
  analysis: {
    label: "Em Análise",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100 border-blue-200 dark:border-blue-800"
  },
  resolution: {
    label: "Em Resolução",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-100 border-purple-200 dark:border-purple-800"
  },
  solved: {
    label: "Solucionado",
    className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-100 border-green-200 dark:border-green-800"
  },
  closing: {
    label: "Em Fechamento",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-100 border-orange-200 dark:border-orange-800"
  },
  closed: {
    label: "Encerrado",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-100 border-gray-200 dark:border-gray-800"
  }
};

export const RNCStatusBadge = ({ status }: RNCStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.className} animate-fade-in font-medium px-3 py-1 rounded-full shadow-sm border`}
    >
      {config.label}
    </Badge>
  );
};