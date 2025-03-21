import * as React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { RNCFilters } from "@/pages/quality/home/components/RNCFilters";
import { RNCDetails } from "@/pages/quality/rnc/RNCDetails"
import { RNCStats } from "@/components/dashboard/RNCStats";
import { RNCTable } from "@/pages/quality/home/components/RNCTable";
import { CreateRNCModal } from "@/components/rnc/CreateRNCModal";
import { DeleteRNCDialog } from "@/components/rnc/DeleteRNCDialog";
import { useRNCs } from "@/hooks/useRNCs";
import { useRNCList } from "@/hooks/useRNCList";
import { RNC, RncDepartmentEnum, RncStatusEnum, RncTypeEnum } from "@/types/rnc";
import { rncService } from "@/services/rncService";
import { useLocation } from "react-router-dom";

const Index = () => {
  // RNC List Management
  const { rncs, loading: isLoading, error, refetch } = useRNCList();
  const [selectedRNC, setSelectedRNC] = useState<string | null>(null);
  const location = useLocation();
  const mounted = useRef(false);

  // Component mount/unmount
  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      setSelectedRNC(null);
    };
  }, []);

  // Clear selection on route change
  React.useEffect(() => {
    if (mounted.current) {
      setSelectedRNC(null);
    }
  }, [location.pathname]);

  const handleSelectRNC = React.useCallback((id: string) => {
    if (!mounted.current) return;

      setSelectedRNC(null);
      // Use Promise.resolve to ensure clean state
      Promise.resolve().then(() => {
        if (mounted.current) {
          setSelectedRNC(id);
        }
      });
  }, []);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<RncStatusEnum | null>(null);
  const [selectedType, setSelectedType] = useState<RncTypeEnum | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<RncDepartmentEnum | null>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRNCData, setSelectedRNCData] = useState<RNC | null>(null);

  // Apply Filters
  const { filteredRNCs } = useRNCs({
    rncs,
    selectedStatus,
    selectedType,
    selectedDepartment,
    searchTerm,
  });

  const handleFilterChange = (key: string, value) => {
    switch (key) {
      case 'searchTerm':
        setSearchTerm(value);
        break;
      case 'selectedStatus':
        setSelectedStatus(value);
        break;
      case 'selectedType':
        setSelectedType(value);
        break;
      case 'selectedDepartment':
        setSelectedDepartment(value);
        break;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRNCData) return;
    
    try {
      await rncService.delete(selectedRNCData.id);
      toast.success("RNC excluída com sucesso!");
      
      // Refresh the RNC List
      await refetch();
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      setSelectedRNCData(null);
    } catch (error) {
      console.error('Error deleting RNC:', error);
      toast.error("Erro ao excluir RNC");
    }
  };

  if (error) {
    toast.error("Erro ao carregar RNCs");
    return <div>Erro ao carregar RNCs...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="glass-card p-8 animate-scale-in dark:bg-gray-800/50">
          <div className="mb-8">
            <RNCStats rncs={filteredRNCs} isLoading={isLoading} />
          </div>

          <RNCFilters 
            filters={{
              searchTerm,
              selectedStatus,
              selectedType,
              selectedDepartment
            }}
            onFilterChange={handleFilterChange}
            onCreateRNC={() => setIsCreateModalOpen(true)}
          />
          
          <RNCTable 
            rncs={filteredRNCs}
            isLoading={isLoading}
            onSelectRNC={handleSelectRNC}
          />

          {selectedRNC && (
            <RNCDetails
              id={selectedRNC}
              onClose={() => setSelectedRNC(null)}
            />
          )}

          <CreateRNCModal
            open={isCreateModalOpen}
            onClose={() => {
              setIsCreateModalOpen(false);
              refetch();
            }}
          />

          {selectedRNCData && (
            <>
              <DeleteRNCDialog
                open={isDeleteDialogOpen}
                onClose={() => {
                  setIsDeleteDialogOpen(false);
                  setSelectedRNCData(null);
                }}
                rncId={selectedRNCData.id}
                rncNumber={selectedRNCData.rnc_number}
                onConfirm={handleDeleteConfirm}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;