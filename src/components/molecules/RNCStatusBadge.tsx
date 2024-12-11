import { Badge } from "@/components/ui/badge";

interface RNCStatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  open: {
    label: "Aberto",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
  },
  analysis: {
    label: "Em Análise",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
  },
  resolution: {
    label: "Em Resolução",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
  },
  solved: {
    label: "Solucionado",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
  },
  closing: {
    label: "Em Fechamento",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
  },
  closed: {
    label: "Encerrado",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
  }
};

export const RNCStatusBadge = ({ status }: RNCStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.open;
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.className} animate-fade-in font-medium px-3 py-1 rounded-full border-none`}
    >
      {config.label}
    </Badge>
  );
};