import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { RNCFormData } from "@/types/rnc";
import { RNCForm } from "@/components/quality/RNCForm";

const Apps = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: RNCFormData): Promise<string> => {
    try {
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-semibold">Registro de Não Conformidade (RNC)</h1>
            <p className="text-sm md:text-base text-gray-500">Gerencie todas as não conformidades registradas</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Nova RNC
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <RNCForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input placeholder="Buscar RNCs..." className="w-full" />
          </div>
          <Button variant="outline" className="w-full md:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Número</TableHead>
                  <TableHead className="min-w-[200px]">Título</TableHead>
                  <TableHead className="min-w-[150px]">Contato</TableHead>
                  <TableHead className="min-w-[150px]">Departamento</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Data</TableHead>
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
                    <TableCell className="font-medium">{rnc.title}</TableCell>
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
        </div>
      </div>
    </div>
  );
};

export default Apps;