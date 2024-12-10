import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRNCs } from "@/hooks/useRNCs";
import { RNCFormData } from "@/types/rnc";
import { RNCListHeader } from "./RNCListHeader";
import { RNCListFilters } from "./RNCListFilters";
import { RNCListTable } from "./RNCListTable";

export function RNCListContainer() {
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
      <RNCListHeader 
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        onSubmit={handleSubmit}
      />
      
      <main className="flex-1 p-6">
        <RNCListFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />

        <RNCListTable
          rncs={filteredRncs}
          isLoading={isLoading}
          onRowClick={(id) => navigate(`/quality/rnc/${id}`)}
        />
      </main>
    </div>
  );
}