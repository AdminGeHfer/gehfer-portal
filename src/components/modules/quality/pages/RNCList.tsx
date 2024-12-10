import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RNCForm } from "@/components/quality/RNCForm";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { RNCFormData, WorkflowStatusEnum } from "@/types/rnc";
import { RNCStatusBadge } from "@/components/molecules/RNCStatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RNCList = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: RNCFormData): Promise<string> => {
    try {
      // TODO: Implement API integration
      console.log('Creating RNC:', data);
      setIsFormOpen(false);
      toast({
        title: "RNC criada com sucesso",
        description: "A RNC foi registrada no sistema.",
      });
      return "temp-id";
    } catch (error) {
      toast({
        title: "Erro ao criar RNC",
        description: "Não foi possível criar a RNC.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const rncs = [
    {
      id: 1,
      rnc_number: 67,
      title: "Produto entregue com defeito",
      company: "PX COMERCIO DE FERRO E ACO PNTALENSE LTDA",
      department: "Qualidade",
      workflow_status: WorkflowStatusEnum.RESOLUTION,
      priority: "medium",
      date: "09/12/2024"
    },
    {
      id: 2,
      rnc_number: 66,
      title: "Material fora das especificações",
      company: "BORTOLON",
      department: "Qualidade",
      workflow_status: WorkflowStatusEnum.SOLVED,
      priority: "medium",
      date: "05/12/2024"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Qualidade" />
      
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-card">
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => navigate("/apps")}
            >
              Voltar para Apps
            </Button>
          </div>
          <nav className="space-y-1 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => navigate("/quality/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start bg-primary/10 text-primary hover:bg-primary/20"
            >
              RNCs
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">Registro de Não Conformidade (RNC)</h1>
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
                <RNCForm onSubmit={handleSubmit} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar RNCs..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="open">Aberto</SelectItem>
                <SelectItem value="analysis">Em Análise</SelectItem>
                <SelectItem value="resolution">Em Resolução</SelectItem>
                <SelectItem value="solved">Solucionado</SelectItem>
                <SelectItem value="closing">Em Fechamento</SelectItem>
                <SelectItem value="closed">Encerrado</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Todos os Departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                <SelectItem value="Expedição">Expedição</SelectItem>
                <SelectItem value="Logistica">Logística</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
                <SelectItem value="Qualidade">Qualidade</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Todas as Prioridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-card rounded-lg border animate-fade-in">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px]">Número</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead className="w-[150px]">Departamento</TableHead>
                  <TableHead className="w-[150px]">Status</TableHead>
                  <TableHead className="w-[120px]">Prioridade</TableHead>
                  <TableHead className="w-[120px]">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rncs.map((rnc) => (
                  <TableRow
                    key={rnc.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/quality/rnc/${rnc.id}`)}
                  >
                    <TableCell className="font-medium">#{rnc.rnc_number}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{rnc.company}</TableCell>
                    <TableCell>{rnc.department}</TableCell>
                    <TableCell>
                      <RNCStatusBadge status={rnc.workflow_status} />
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        rnc.priority === "high"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                          : rnc.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                      }`}>
                        {rnc.priority === "high" ? "Alta" : rnc.priority === "medium" ? "Média" : "Baixa"}
                      </span>
                    </TableCell>
                    <TableCell>{rnc.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RNCList;