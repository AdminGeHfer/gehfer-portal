import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Eye, FileIcon, ImageIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CollectionStatus } from "@/types/collection";

interface CollectionCardProps {
  collection: any;
  onStatusChange: (id: string, status: CollectionStatus) => void;
  onEdit: (collection: any) => void;
  onDelete: (id: string) => void;
  onView: (collection: any) => void;
  onDownloadEvidence: (evidence: any) => void;
}

export function CollectionCard({
  collection,
  onStatusChange,
  onEdit,
  onDelete,
  onView,
  onDownloadEvidence
}: CollectionCardProps) {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">
            RNC #{collection.rnc.rnc_number}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Criado em: {format(new Date(collection.created_at), "dd/MM/yyyy HH:mm")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            defaultValue={collection.status}
            onValueChange={(value) => onStatusChange(collection.id, value as CollectionStatus)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue>
                <Badge
                  variant={collection.status === "completed" ? "default" : "secondary"}
                >
                  {collection.status === "pending"
                    ? "Pendente"
                    : collection.status === "in_progress"
                    ? "Em Andamento"
                    : "Concluído"}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onView(collection)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(collection)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
            onClick={() => onDelete(collection.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Endereço: {collection.collection_address}
            </p>
            {collection.notes && (
              <p className="text-sm text-muted-foreground mt-2">
                Observações: {collection.notes}
              </p>
            )}
          </div>

          {collection.return_items?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Itens para Coleta</h4>
              <ul className="space-y-2">
                {collection.return_items.map((item: any) => (
                  <li key={item.id} className="flex justify-between items-center">
                    <span>{item.product?.name || 'Produto não encontrado'}</span>
                    <span>{item.weight}kg</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {collection.collection_evidence?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Evidências</h4>
              <div className="grid gap-2">
                {collection.collection_evidence.map((evidence: any) => (
                  <div
                    key={evidence.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      {getFileIcon(evidence.filename)}
                      <span className="text-sm">{evidence.filename}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownloadEvidence(evidence)}
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}