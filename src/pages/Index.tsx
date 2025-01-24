import * as React from "react";
import { ComplaintFilters } from "@/components/dashboard/ComplaintFilters";
import { ComplaintDetails } from "@/components/dashboard/ComplaintDetails";
import { ComplaintHeader } from "@/components/dashboard/ComplaintHeader";
import { ComplaintStats } from "@/components/dashboard/ComplaintStats";
import { ComplaintTable } from "@/components/dashboard/ComplaintTable";
import { CreateRNCModal } from "@/components/rnc/CreateRNCModal";
import { useComplaintFilters } from "@/hooks/useComplaintFilters";
import { useComplaints } from "@/hooks/useComplaints";
import { ComplaintPageHeader } from "@/components/rnc/header/ComplaintPageHeader";

const Index = () => {
  const {
    complaints,
    selectedComplaint,
    setSelectedComplaint,
    handleStatusUpdate,
  } = useComplaints();

  const { filters, handleFilterChange, filteredComplaints } = useComplaintFilters(complaints);

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-gray-900">
      <ComplaintHeader />
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="glass-card p-8 animate-scale-in dark:bg-gray-800/50">
          <div className="mb-8">
            <ComplaintPageHeader onCreateRNC={() => {}} />
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

          {/* Modal layout shown for visualization */}
          <div className="mt-8 border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Modal Preview:</h3>
            <CreateRNCModal open={true} onClose={() => {}} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;