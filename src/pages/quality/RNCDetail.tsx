import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Printer, Trash, UserPlus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { RNCTimeline } from "@/components/quality/RNCTimeline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { RNCForm } from "@/components/quality/RNCForm";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RNCDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  // Example timeline events
  const timelineEvents = [
    {
      id: "1",
      date: "15/03/2024 07:00",
      title: "RNC Criada",
      description: "RNC registrada no sistema",
      type: "creation" as const,
    },
    {
      id: "2",
      date: "15/03/2024 08:30",
      title: "Atualização de Status",
      description: "Status alterado para 'Em Análise'",
      type: "status" as const,
    },
    {
      id: "3",
      date: "15/03/2024 14:15",
      title: "Comentário Adicionado",
      description: "Análise inicial realizada, aguardando feedback do fornecedor",
      type: "comment" as const,
    },
  ];

  const handleEdit = async (data: any) => {
    try {
      // TODO: Implement API integration
      console.log('Editing RNC:', data);
      setIsEditDialogOpen(false);
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
      console.log('Deleting RNC:', id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "RNC excluída",
        description: "A RNC foi excluída com sucesso.",
      });
      navigate("/quality/rnc");
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a RNC.",
        variant: "destructive",
      });
    }
  };

  const handleAssign = async (userId: string) => {
    try {
      // TODO: Implement API integration
      console.log('Assigning RNC:', id, 'to user:', userId);
      setIsAssignDialogOpen(false);
      toast({
        title: "RNC atribuída",
        description: "A RNC foi atribuída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atribuir",
        description: "Não foi possível atribuir a RNC.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Qualidade" />
      
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-white">
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/apps")}
            >
              Voltar para Apps
            </Button>
          </div>
          <nav className="space-y-1 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/quality/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
            >
              RNCs
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate("/quality/rnc")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold">RNC #{id}</h1>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-800">
                    Aberto
                  </span>
                </div>
                <p className="text-gray-500">Produto entregue com defeito</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsAssignDialogOpen(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Atribuir
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-4">Dados da Empresa</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Razão Social</p>
                    <p>Empresa Exemplo LTDA</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CNPJ</p>
                    <p>12.345.678/0001-90</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-4">Dados</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nº do Pedido</p>
                    <p>PED-2024-001</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nº da Devolução</p>
                    <p>DEV-2024-001</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Departamento</p>
                    <p>Produção</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data de criação</p>
                    <p>15/03/2024, 07:00:00</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-4">Descrição</h2>
                <p>Cliente relatou que o produto chegou com arranhões</p>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-4">Resolução</h2>
                <p>Produto substituído e processo de embalagem revisado</p>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-lg font-semibold mb-4">Anexos</h2>
                <p className="text-gray-500">Nenhum anexo disponível</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border h-fit">
              <h2 className="text-lg font-semibold mb-4">Contato</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p>João da Silva</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p>5511999999999</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>joao@empresa.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <RNCTimeline events={timelineEvents} />
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <RNCForm
                mode="edit"
                initialData={{
                  title: "Produto entregue com defeito",
                  description: "Cliente relatou que o produto chegou com arranhões",
                  priority: "medium",
                  department: "Produção",
                  contact: "João da Silva",
                  company: "Empresa Exemplo LTDA",
                  cnpj: "12345678901234",
                  status: "open",
                }}
                onSubmit={handleEdit}
              />
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir RNC</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir esta RNC? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Assign Dialog */}
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Atribuir RNC</DialogTitle>
                <DialogDescription>
                  Selecione um usuário para atribuir esta RNC.
                </DialogDescription>
              </DialogHeader>
              <Select onValueChange={handleAssign}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">João Silva</SelectItem>
                  <SelectItem value="2">Maria Santos</SelectItem>
                  <SelectItem value="3">Pedro Oliveira</SelectItem>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAssignDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default RNCDetail;