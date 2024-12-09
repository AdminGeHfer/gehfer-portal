import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RNCForm } from "@/components/quality/RNCForm";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRNCs } from "@/hooks/useRNCs";
import { RNCStatusBadge } from "@/components/molecules/RNCStatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { RNCFormData } from "@/types/rnc";
import { WorkflowStatusEnum } from "@/types/rnc";

const RNCList = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { rncs, isLoading, createRNC } = useRNCs();

  const handleSubmit = async (data: RNCFormData): Promise<string> => {
    try {
      const result = await createRNC.mutateAsync(data);
      setIsFormOpen(false);
      return result.id;
    } catch (error) {
      console.error("Erro ao criar RNC:", error);
      throw error;
    }
  };

  const filteredRncs = rncs?.filter((rnc) => {
    const matchesSearch = 
      searchTerm === "" ||
      rnc.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rnc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rnc.rnc_number?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || rnc.workflow_status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || rnc.department === departmentFilter;
    const matchesPriority = priorityFilter === "all" || rnc.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesDepartment && matchesPriority;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Lista de RNCs" />
      
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Registro de Não Conformidade (RNC)</h1>
            <p className="text-muted-foreground">Gerencie todas as não conformidades registradas</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Nova RNC
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Nova RNC</DialogTitle>
              </DialogHeader>
              <RNCForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar RNCs..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value={WorkflowStatusEnum.OPEN}>Aberto</SelectItem>
              <SelectItem value={WorkflowStatusEnum.ANALYSIS}>Em Análise</SelectItem>
              <SelectItem value={WorkflowStatusEnum.RESOLUTION}>Em Resolução</SelectItem>
              <SelectItem value={WorkflowStatusEnum.SOLVED}>Solucionado</SelectItem>
              <SelectItem value={WorkflowStatusEnum.CLOSING}>Em Fechamento</SelectItem>
              <SelectItem value={WorkflowStatusEnum.CLOSED}>Encerrado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Departamentos</SelectItem>
              <SelectItem value="Expedição">Expedição</SelectItem>
              <SelectItem value="Logistica">Logística</SelectItem>
              <SelectItem value="Comercial">Comercial</SelectItem>
              <SelectItem value="Qualidade">Qualidade</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Prioridades</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">Número</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredRncs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhuma RNC encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredRncs.map((rnc) => (
                  <TableRow
                    key={rnc.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/quality/rnc/${rnc.id}`)}
                  >
                    <TableCell className="font-medium">#{rnc.rnc_number || '-'}</TableCell>
                    <TableCell>{rnc.company}</TableCell>
                    <TableCell>{rnc.department}</TableCell>
                    <TableCell>
                      <RNCStatusBadge status={rnc.workflow_status} />
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        rnc.priority === 'high' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : rnc.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {rnc.priority === 'high' ? 'Alta' : rnc.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {format(new Date(rnc.created_at), "dd/MM/yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default RNCList;
