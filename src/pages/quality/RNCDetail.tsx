import { Header } from "@/components/layout/Header";
import { RNCTimeline } from "@/components/quality/RNCTimeline";
import { RNCPrintLayout } from "@/components/quality/RNCPrintLayout";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { RNC } from "@/types/rnc";
import { RNCDetailHeader } from "@/components/quality/detail/RNCDetailHeader";
import { RNCDetailForm } from "@/components/quality/detail/RNCDetailForm";
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

const RNCDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Example RNC data - in a real app, this would come from an API
  const [rnc, setRnc] = useState<RNC>({
    id: id || "",
    title: "Produto entregue com defeito",
    description: "Cliente relatou que o produto chegou com arranhões",
    status: "open",
    priority: "medium",
    type: "client",
    department: "Produção",
    contact: {
      name: "João da Silva",
      phone: "11999999999",
      email: "joao@empresa.com"
    },
    company: "Empresa Exemplo LTDA",
    cnpj: "12.345.678/0001-90",
    orderNumber: "PED-2024-001",
    returnNumber: "DEV-2024-001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: []
  });

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API integration
      setIsEditing(false);
      toast({
        title: "RNC atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a RNC.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      // TODO: Implement API integration
      setIsDeleteDialogOpen(false);
      toast({
        title: "RNC excluída",
        description: "A RNC foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a RNC.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsApp = () => {
    const phone = rnc.contact.phone.replace(/\D/g, "");
    const message = encodeURIComponent(`Olá! Gostaria de falar sobre a RNC #${id}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleFieldChange = (field: keyof RNC, value: any) => {
    if (field === "contact") {
      setRnc(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [value.target.name]: value.target.value
        }
      }));
    } else {
      setRnc(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (isPrinting) {
    return <RNCPrintLayout rnc={rnc} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 no-print">
      <Header title="Qualidade" />
      
      <div className="flex min-h-screen">
        <main className="flex-1 p-6">
          <RNCDetailHeader
            id={id || ""}
            rnc={rnc}
            isEditing={isEditing}
            onEdit={handleEdit}
            onSave={handleSave}
            onDelete={() => setIsDeleteDialogOpen(true)}
            onPrint={handlePrint}
            onWhatsApp={handleWhatsApp}
          />

          <RNCDetailForm
            rnc={rnc}
            isEditing={isEditing}
            onChange={handleFieldChange}
          />

          <div className="mt-6">
            <RNCTimeline events={rnc.timeline} />
          </div>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir RNC</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta RNC? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  );
};

export default RNCDetail;