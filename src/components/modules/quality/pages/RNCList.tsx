import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as React from "react";
import { useToast } from "@/components/ui/use-toast";
import { RNCFormData } from "@/types/rnc";
import { RNCListHeader } from "@/components/quality/list/RNCListHeader";
import { RNCListFilters } from "@/components/quality/list/RNCListFilters";
import { RNCListTable } from "@/components/quality/list/RNCListTable";
import { useRNCs } from "@/hooks/useRNCs";
import { transformRNCData } from "@/utils/rncTransform";

const RNCList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { createRNC, rncs, isLoading } = useRNCs();

  const handleSubmit = async (data: RNCFormData): Promise<string> => {
    try {
      await createRNC.mutateAsync(data);
      toast({
        title: "RNC criada com sucesso",
        description: "A RNC foi registrada no sistema.",
      });
      setIsFormOpen(false);
      return "success";
    } catch (error) {
      console.error('Error creating RNC:', error);
      toast({
        title: "Erro ao criar RNC",
        description: "Não foi possível criar a RNC.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const filteredRncs = rncs?.map(transformRNCData).filter((rnc) => {
    const matchesSearch = 
      searchTerm === "" ||
      rnc.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rnc.rnc_number?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || rnc.workflow_status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || rnc.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Qualidade" />
      
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-white dark:bg-gray-800">
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
          <RNCListHeader 
            onRNCCreated={handleSubmit}
            isFormOpen={isFormOpen}
            setIsFormOpen={setIsFormOpen}
          />
          
          <RNCListFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            departmentFilter={departmentFilter}
            onDepartmentChange={setDepartmentFilter}
          />

          <RNCListTable
            rncs={filteredRncs}
            onRowClick={(id) => navigate(`/quality/rnc/${id}`)}
            isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  );
};

export default RNCList;