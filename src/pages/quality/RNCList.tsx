import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRNCs } from "@/hooks/useRNCs";
import { RNCListHeader } from "@/components/quality/list/RNCListHeader";
import { RNCListFilters } from "@/components/quality/list/RNCListFilters";
import { RNCListTable } from "@/components/quality/list/RNCListTable";

const RNCList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const { rncs, isLoading, refetch } = useRNCs();

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
      
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-card">
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
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/quality/collections")}
            >
              Coletas
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <RNCListHeader onRNCCreated={refetch} />
          
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
            rncs={filteredRncs}
            isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  );
};

export default RNCList;