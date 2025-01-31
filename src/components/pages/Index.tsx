import { useState } from "react";
import * as React from "react";
import { toast } from "sonner";
import { ComplaintFilters } from "@/components/dashboard/ComplaintFilters";
import { ComplaintDetails } from "@/components/dashboard/ComplaintDetails";
import { ComplaintStats } from "@/components/dashboard/ComplaintStats";
import { ComplaintTable } from "@/components/dashboard/ComplaintTable";
import { CreateRNCModal } from "@/components/rnc/CreateRNCModal";
import { EditRNCModal } from "@/components/rnc/EditRNCModal";
import { DeleteRNCDialog } from "@/components/rnc/DeleteRNCDialog";
import { useComplaints } from "@/hooks/useComplaints";
import { useComplaintFilters } from "@/hooks/useComplaintFilters";
import { RNC } from "@/types/rnc";

const Index = () => {
  const { complaints, selectedComplaint, setSelectedComplaint, isCreateModalOpen, setIsCreateModalOpen } = useComplaints();
  const { filters, handleFilterChange, filteredComplaints } = useComplaintFilters(complaints);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRNC, setSelectedRNC] = useState<RNC | null>(null);

  const handleEdit = (rnc: RNC) => {
    setSelectedRNC(rnc);
    setIsEditModalOpen(true);
  };

  const handleDelete = (rnc: RNC) => {
    setSelectedRNC(rnc);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="glass-card p-8 animate-scale-in dark:bg-gray-800/50">
          <div className="mb-8">
            <ComplaintStats complaints={complaints} />
          </div>

          <ComplaintFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onCreateRNC={() => setIsCreateModalOpen(true)}
          />
          
          <ComplaintTable 
            complaints={filteredComplaints} 
            onSelectComplaint={setSelectedComplaint}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {selectedComplaint && (
            <ComplaintDetails
              complaint={complaints.find((c) => c.id === selectedComplaint)!}
              onStatusUpdate={() => toast.success("Status atualizado com sucesso!")}
              onClose={() => setSelectedComplaint(null)}
            />
          )}

          <CreateRNCModal
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />

          {selectedRNC && (
            <>
              <EditRNCModal
                open={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setSelectedRNC(null);
                }}
                rncData={selectedRNC}
                rncId={selectedRNC.id}
              />

              <DeleteRNCDialog
                open={isDeleteDialogOpen}
                onClose={() => {
                  setIsDeleteDialogOpen(false);
                  setSelectedRNC(null);
                }}
                rncId={selectedRNC.id}
                rncNumber={selectedRNC.rnc_number}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;