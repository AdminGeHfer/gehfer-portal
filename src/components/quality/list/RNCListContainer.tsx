import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RNCListHeader } from "./RNCListHeader";
import { RNCListFilters } from "./RNCListFilters";
import { RNCListTable } from "./RNCListTable";
import { transformRNCData } from "@/utils/rncTransform";
import { RNCFormData } from "@/types/rnc";
import { useRNCs } from "@/hooks/useRNCs";

export function RNCListContainer() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const { rncs, isLoading, createRNC } = useRNCs();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredRncs = rncs?.map(transformRNCData).filter((rnc) => {
    const matchesSearch = 
      searchTerm === "" ||
      rnc.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rnc.rnc_number?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || rnc.workflow_status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || rnc.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  }) || [];

  const handleRNCCreated = async (data: RNCFormData): Promise<string> => {
    try {
      const result = await createRNC.mutateAsync(data);
      setIsFormOpen(false);
      return result.id; // Return the ID as required by the type
    } catch (error) {
      console.error('Error creating RNC:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <RNCListHeader 
          onRNCCreated={handleRNCCreated}
          isFormOpen={isFormOpen}
          setIsFormOpen={setIsFormOpen}
        />
      
        <div className="space-y-6">
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
            isLoading={isLoading}
            onRowClick={(id) => navigate(`/quality/rnc/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}