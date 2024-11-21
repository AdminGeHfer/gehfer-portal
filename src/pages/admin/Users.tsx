import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Mail, Lock, UserCog } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserForm } from "@/components/admin/UserForm";
import { useUsers } from "@/hooks/useUsers";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { data: users, isLoading } = useUsers();

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header title="Gerenciamento de Usuários" />
      
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 flex-1 max-w-sm">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
              </DialogHeader>
              <UserForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Módulos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Carregando...</TableCell>
                </TableRow>
              ) : filteredUsers?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {user.modules.map((module) => (
                        <Badge key={module} variant="secondary">
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.active ? "success" : "destructive"}>
                      {user.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toast({ title: "Email enviado", description: "Um email de redefinição de senha foi enviado" })}>
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toast({ title: "Senha alterada", description: "A senha foi alterada com sucesso" })}>
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <UserCog className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Usuário</DialogTitle>
                          </DialogHeader>
                          <UserForm user={user} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}