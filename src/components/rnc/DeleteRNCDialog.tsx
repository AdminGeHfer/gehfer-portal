import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { rncService } from "@/services/rncService";

interface DeleteRNCDialogProps {
  open: boolean;
  onClose: () => void;
  rncId: string;
  rncNumber?: number;
  onConfirm: () => Promise<void>;
}

export const DeleteRNCDialog = ({ open, onClose, rncId, rncNumber, onConfirm }: DeleteRNCDialogProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await rncService.delete(rncId);
      await onConfirm();
      toast.success('RNC excluída com sucesso!');
      onClose();
    } catch (error) {
      console.error('Error deleting RNC:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir RNC');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir RNC #{rncNumber}</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta RNC? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};