import { useState } from "react";
import * as React from "react";
import { toast } from "sonner";
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
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Modal Preview:</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <CreateRNCModal open={true} onClose={() => {}} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;