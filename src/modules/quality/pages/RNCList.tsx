import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RNCForm } from "@/components/quality/RNCForm";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { RNCFormData } from "@/types/rnc";

const RNCList = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: RNCFormData) => {
    try {
      // TODO: Implement API integration
      console.log('Creating RNC:', data);
      setIsFormOpen(false);
      toast({
        title: "RNC criada com sucesso",
        description: "A RNC foi registrada no sistema.",
      });
    } catch (error) {
      toast({
        title: "Erro ao criar RNC",
        description: "Não foi possível criar a RNC.",
        variant: "destructive",
      });
    }
  };

  const rncs = [
    {
      id: 1,
      title: "Produto entregue com defeito",
      contact: "João da Silva",
      department: "Produção",
      status: "Aberto",
      date: "15/03/2024"
    },
    {
      id: 2,
      title: "Material fora das especificações",
      contact: "Maria Santos",
      department: "Qualidade",
      status: "Em Andamento",
      date: "14/03/2024"
    }
  ];

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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-2">Registro de Não Conformidade (RNC)</h1>
              <p className="text-gray-500">Gerencie todas as não conformidades registradas</p>
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova RNC
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <RNCForm onSubmit={handleSubmit} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input placeholder="Buscar RNCs..." />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>

          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rncs.map((rnc) => (
                  <TableRow
                    key={rnc.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/quality/rnc/${rnc.id}`)}
                  >
                    <TableCell>#{rnc.id}</TableCell>
                    <TableCell>{rnc.title}</TableCell>
                    <TableCell>{rnc.contact}</TableCell>
                    <TableCell>{rnc.department}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        rnc.status === "Aberto"
                          ? "bg-yellow-50 text-yellow-800"
                          : "bg-blue-50 text-blue-800"
                      }`}>
                        {rnc.status}
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

