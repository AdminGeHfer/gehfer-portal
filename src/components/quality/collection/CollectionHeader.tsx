import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface CollectionHeaderProps {
  collection: any;
}

export function CollectionHeader({ collection }: CollectionHeaderProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "in_progress":
        return "Em Andamento";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return "Pendente";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      case "in_progress":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-lg">
          Coleta #{String(collection.id).slice(-4)}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          RNC #{collection.rnc.rnc_number} - Criado em:{" "}
          {format(new Date(collection.created_at), "dd/MM/yyyy HH:mm")}
        </p>
      </div>
      <Badge variant={getStatusVariant(collection.status)}>
        {getStatusText(collection.status)}
      </Badge>
    </CardHeader>
  );
}