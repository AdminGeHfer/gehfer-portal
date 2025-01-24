import { useState } from "react";
import * as React from "react";
import { ComplaintFilters } from "@/components/dashboard/ComplaintFilters";
import { ComplaintDetails } from "@/components/dashboard/ComplaintDetails";
import { ComplaintHeader } from "@/components/dashboard/ComplaintHeader";
import { ComplaintStats } from "@/components/dashboard/ComplaintStats";
import { ComplaintTable } from "@/components/dashboard/ComplaintTable";
import { CreateRNCModal } from "@/components/rnc/CreateRNCModal";
import { ComplaintPageHeader } from "@/components/rnc/header/ComplaintPageHeader";
import { useComplaintFilters } from "@/hooks/useComplaintFilters";
import { useComplaints } from "@/hooks/useComplaints";

const Index = () => {
  const {
    complaints,
    selectedComplaint,
    setSelectedComplaint,
    handleStatusUpdate,
  } = useComplaints();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { filters, handleFilterChange, filteredComplaints } = useComplaintFilters(complaints);

  const handleOpenModal = () => {
    console.log("Opening modal"); // Debug log
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal"); // Debug log
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-gray-900">
      <ComplaintHeader />
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="glass-card p-8 animate-scale-in dark:bg-gray-800/50">
          <div className="mb-8">
            <ComplaintPageHeader onCreateRNC={handleOpenModal} />
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
            open={isModalOpen} 
            onClose={handleCloseModal}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;