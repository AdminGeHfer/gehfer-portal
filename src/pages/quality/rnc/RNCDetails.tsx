import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { RNCWithRelations } from "@/types/rnc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { rncService } from "@/services/rncService";
import { DeleteRNCDialog } from "@/components/rnc/DeleteRNCDialog";

interface RNCDetailsProps {
  rnc: RNCWithRelations;
  onClose?: () => void;
  variant?: 'modal' | 'page';
  isLoading?: boolean;
  isDeleting?: boolean;
}

export function RNCDetails({ 
  rnc, 
  onClose, 
  variant = 'modal',
  isLoading = false,
}: RNCDetailsProps) {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [,setIsEditing] = React.useState(false);

  const handleDelete = async () => {
    try {
      await rncService.delete(rnc.id);
      if (variant === 'page') {
        navigate("/quality/home", { replace: true });
      } else {
        onClose?.();
      }
    } catch (error) {
      console.error('Error deleting RNC:', error);
      toast.error("Erro ao excluir RNC");
    }
  };

  if (isLoading) {
    return <div>Carregando detalhes...</div>;
  }

  const renderContent = () => (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Informações Básicas</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <p className="text-sm text-gray-500">Empresa</p>
            <p>{rnc.company}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Data de Criação</p>
            <p>
              {format(new Date(rnc.created_at), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p>{rnc.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tipo</p>
            <p>{rnc.type}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Descrição</h3>
        <p className="mt-2">{rnc.description}</p>
      </div>

      {rnc.conclusion && (
        <div>
          <h3 className="font-semibold">Conclusão</h3>
          <p className="mt-2">{rnc.conclusion}</p>
        </div>
      )}

      {rnc.contacts && rnc.contacts.length > 0 && (
        <div>
          <h3 className="font-semibold">Contatos</h3>
          <div className="space-y-2 mt-2">
            {rnc.contacts.map((contact) => (
              <div key={contact.id}>
                <p>{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.phone}</p>
                {contact.email && (
                  <p className="text-sm text-gray-500">{contact.email}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">RNC #{rnc.rnc_number}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">RNC #{rnc.rnc_number}</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
        {renderContent()}
      </div>

      <DeleteRNCDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        rncId={rnc.id}
        rncNumber={rnc.rnc_number}
        onConfirm={handleDelete}
      />
    </div>
  );
}
