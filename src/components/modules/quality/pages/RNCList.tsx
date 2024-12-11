import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { RNCFormData } from "@/types/rnc";
import { RNCListHeader } from "@/components/quality/list/RNCListHeader";
import { RNCListFilters } from "@/components/quality/list/RNCListFilters";
import { RNCListTable } from "@/components/quality/list/RNCListTable";

const RNCList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const handleSubmit = async (data: RNCFormData): Promise<string> => {
    try {
      // TODO: Implement API integration
      console.log('Creating RNC:', data);
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
      id: "1",
      rnc_number: 67,
      title: "Produto entregue com defeito",
      company: "PX COMERCIO DE FERRO E ACO PNTALENSE LTDA",
      department: "Qualidade",
      workflow_status: "resolution",
      priority: "medium",
      date: "09/12/2024"
    },
    {
      id: "2",
      rnc_number: 66,
      title: "Material fora das especificações",
      company: "BORTOLON",
      department: "Qualidade",
      workflow_status: "solved",
      priority: "medium",
      date: "05/12/2024"
    }
  ];

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
          <RNCListHeader onRNCCreated={handleSubmit} />
          
          <RNCListFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            departmentFilter={departmentFilter}
            onDepartmentChange={setDepartmentFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
          />

          <RNCListTable
            rncs={rncs}
            onRowClick={(id) => navigate(`/quality/rnc/${id}`)}
          />
        </main>
      </div>
    </div>
  );
};

export default RNCList;