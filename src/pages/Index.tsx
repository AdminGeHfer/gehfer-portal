import * as React from "react";
import { ComplaintFilters } from "@/components/dashboard/ComplaintFilters";
import { ComplaintDetails } from "@/components/dashboard/ComplaintDetails";
import { ComplaintHeader } from "@/components/dashboard/ComplaintHeader";
import { ComplaintStats } from "@/components/dashboard/ComplaintStats";
import { ComplaintTable } from "@/components/dashboard/ComplaintTable";
import { CreateRNCModal } from "@/components/rnc/CreateRNCModal";
import { Button } from "@/components/ui/button";
import { useComplaintFilters } from "@/hooks/useComplaintFilters";
import { useComplaints } from "@/hooks/useComplaints";

const Index = () => {
  const {
    complaints,
    selectedComplaint,
    setSelectedComplaint,
    isCreateModalOpen,
    setIsCreateModalOpen,
    handleStatusUpdate,
  } = useComplaints();

  const { filters, handleFilterChange, filteredComplaints } = useComplaintFilters(complaints);

  const handleOpenModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-gray-900">
      <ComplaintHeader />
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="glass-card p-8 animate-scale-in dark:bg-gray-800/50">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Minhas Reclamações
              </h2>
              <Button
                onClick={handleOpenModal}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Criar RNC
              </Button>
            </div>
            <ComplaintStats complaints={complaints} />
          </div>

          <ComplaintFilters filters={filters} onFilterChange={handleFilterChange} />
          <ComplaintTable 
            complaints={filteredComplaints} 
            onSelectComplaint={setSelectedComplaint} 
          />

          {selectedComplaint && (
            <ComplaintDetails
              complaint={complaints.find((c) => c.id === selectedComplaint)!}
              onStatusUpdate={handleStatusUpdate}
              onClose={() => setSelectedComplaint(null)}
            />
          )}

          <CreateRNCModal
            open={isCreateModalOpen}
            onClose={handleCloseModal}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;