import { Badge } from "@/components/ui/badge";

interface RNCStatusBadgeProps {
  status: "open" | "in_progress" | "closed";
}

const statusConfig = {
  open: {
    label: "Aberto",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
  },
  in_progress: {
    label: "Em Andamento",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
  },
  closed: {
    label: "Fechado",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
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