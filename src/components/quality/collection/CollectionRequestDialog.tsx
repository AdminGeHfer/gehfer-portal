import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CollectionRequestForm } from "./CollectionRequestForm";

interface CollectionRequestDialogProps {
  rncId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CollectionRequestDialog({
  rncId,
  open,
  onOpenChange,
}: CollectionRequestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Solicitar Coleta</DialogTitle>
        </DialogHeader>
        <CollectionRequestForm
          rncId={rncId}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}