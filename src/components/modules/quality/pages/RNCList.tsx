import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { RNC, RNCFormData } from "@/types/rnc";
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

  const handleSubmit = async (data: RNCFormData): Promise<void> => {
    try {
      // TODO: Implement API integration
      console.log('Creating RNC:', data);
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
      throw error;
    }
  };

  const mockRncs: RNC[] = [
    {
      id: "1",
      rnc_number: 67,
      description: "Produto entregue com defeito",
      title: "Produto entregue com defeito",
      company: "PX COMERCIO DE FERRO E ACO PNTALENSE LTDA",
      department: "Qualidade",
      workflow_status: "resolution",
      priority: "medium",
      type: "client",
      contact: {
        name: "João Silva",
        phone: "11999999999",
        email: "joao@example.com"
      },
      cnpj: "12345678901234",
      created_at: "2024-03-09T00:00:00.000Z",
      updated_at: "2024-03-09T00:00:00.000Z",
      created_by: "user-1", // Added missing required field
      timeline: []
    },
    {
      id: "2",
      rnc_number: 66,
      description: "Material fora das especificações",
      title: "Material fora das especificações",
      company: "BORTOLON",
      department: "Qualidade",
      workflow_status: "solved",
      priority: "medium",
      type: "client",
      contact: {
        name: "Maria Santos",
        phone: "11988888888",
        email: "maria@example.com"
      },
      cnpj: "98765432109876",
      created_at: "2024-03-05T00:00:00.000Z",
      updated_at: "2024-03-05T00:00:00.000Z",
      created_by: "user-2", // Added missing required field
      timeline: []
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
          <RNCListHeader onRNCCreated={() => handleSubmit} />
          
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
            rncs={mockRncs}
            onRowClick={(id) => navigate(`/quality/rnc/${id}`)}
          />
        </main>
      </div>
    </div>
  );
};

export default RNCList;