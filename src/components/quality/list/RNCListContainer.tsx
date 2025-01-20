import { useState } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useRNCs } from "@/hooks/useRNCs";
import { RNCListHeader } from "./RNCListHeader";
import { RNCListFilters } from "./RNCListFilters";
import { RNCListTable } from "./RNCListTable";
import { transformRNCData } from "@/utils/rncTransform";
import { RNCFormData } from "@/types/rnc";

export function RNCListContainer() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const { rncs, isLoading, createRNC } = useRNCs();

  const filteredRncs = rncs?.map(transformRNCData).filter((rnc) => {
    const matchesSearch = 
      searchTerm === "" ||
      rnc.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rnc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rnc.rnc_number?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || rnc.workflow_status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || rnc.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  }) || [];

  const handleRNCCreated = async (data: RNCFormData) => {
    await createRNC.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <RNCListHeader onRNCCreated={handleRNCCreated}/>
      
        <div className="space-y-6">
          <RNCListFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            departmentFilter={departmentFilter}
            onDepartmentChange={setDepartmentFilter}
          />
          <RNCListTable rncs={filteredRncs} isLoading={isLoading} onRowClick={(id) => navigate(`/quality/rnc/${id}`)}/>
        </div>
      </div>
    </div>
  );
}