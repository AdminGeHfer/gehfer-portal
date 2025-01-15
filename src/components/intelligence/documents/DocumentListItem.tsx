import { Document } from "@/types/documents/metadata";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2 } from "lucide-react";
import * as React from "react";

interface DocumentListItemProps {
  document: Document;
  onDownload: (id: string, filename: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const DocumentListItem = ({
  document,
  onDownload,
  onDelete
}: DocumentListItemProps) => {
  return (
    <div
      key={document.id}
      className="flex items-center justify-between p-3 border rounded-lg"
    >
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span>{document.filename}</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDownload(document.id, document.filename)}
          className="text-primary hover:text-primary/90"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(document.id)}
          className="text-destructive hover:text-destructive/90"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};