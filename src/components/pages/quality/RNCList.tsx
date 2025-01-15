import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RNCForm } from "@/components/quality/RNCForm";
import { useState } from "react";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRNCs } from "@/hooks/useRNCs";
import { RNCStatusBadge } from "@/components/molecules/RNCStatusBadge";
import { RNCFilters } from "@/components/organisms/RNCFilters";
import { format } from "date-fns";
import { RNCFormData } from "@/types/rnc";

const RNCList = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
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
      rnc.rnc_number?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || rnc.workflow_status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || rnc.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Lista de RNCs" />
      
      <main className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Registro de Não Conformidade (RNC)</h1>
            <p className="text-muted-foreground">Gerencie todas as não conformidades registradas</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
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

        <RNCFilters
          search={searchTerm}
          onSearchChange={setSearchTerm}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          department={departmentFilter}
          onDepartmentChange={setDepartmentFilter}
          onClearFilters={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setDepartmentFilter("all");
          }}
        />

        <div className="rounded-lg border bg-card mt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">Número</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredRncs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
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