import { useState } from "react";
import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { UserPlus, Download, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserForm } from "@/components/admin/UserForm";
import { useUsers } from "@/hooks/useUsers";
import { BackButton } from "@/components/atoms/BackButton";
import { UserList } from "@/components/admin/UserList";
import { UserFilters } from "@/components/admin/UserFilters";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: users, isLoading: isLoadingUsers, refetch } = useUsers();

  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesModule = moduleFilter === 'all' || 
      (user.modules && user.modules.includes(moduleFilter));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' ? user.active : !user.active);

    return matchesSearch && matchesModule && matchesStatus;
  });

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ active: false })
        .eq('id', userId);

      if (error) throw error;

      await refetch();
      toast.success("Usuário desativado com sucesso");
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error("Erro ao desativar usuário");
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate') => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ active: action === 'activate' })
        .eq('active', action === 'deactivate');

      if (error) throw error;

      await refetch();
      toast.success(`Usuários ${action === 'activate' ? 'ativados' : 'desativados'} com sucesso`);
    } catch (error) {
      console.error('Error in bulk action:', error);
      toast.error(`Erro ao ${action === 'activate' ? 'ativar' : 'desativar'} usuários`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportUsers = () => {
    if (!users) return;
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Nome,Email,Módulos,Status\n" +
      users.map(user => 
        `${user.name},${user.email},${user.modules?.join(';') || ''},${user.active ? 'Ativo' : 'Inativo'}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "usuarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Gerenciamento de Usuários" />
      
      <main className="container mx-auto p-6 space-y-6 animate-fade-in">
        <BackButton to="/apps" label="Voltar para Apps" />
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <UserFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                moduleFilter={moduleFilter}
                onModuleFilterChange={setModuleFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleExportUsers}
                disabled={isLoading || !users?.length}
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleBulkAction('activate')}
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Ativar Todos
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="hover:shadow-lg transition-all"
                    onClick={() => setSelectedUser(null)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedUser ? "Editar Usuário" : "Criar Novo Usuário"}
                    </DialogTitle>
                  </DialogHeader>
                  <UserForm 
                    user={selectedUser} 
                    onSuccess={handleDialogClose}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden glass-morphism">
            <UserList
              users={filteredUsers}
              isLoading={isLoadingUsers}
              onEdit={(user) => {
                setSelectedUser(user);
                setIsDialogOpen(true);
              }}
              onDelete={handleDeleteUser}
            />
          </div>
        </div>
      </main>
    </div>
  );
}