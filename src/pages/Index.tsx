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
import { RNC, RncTypeEnum, RncDepartmentEnum, RncStatusEnum, WorkflowStatusEnum } from "@/types/rnc";
import { rncService } from "@/services/rncService";

const Index = () => {
  const { complaints, setComplaints, selectedComplaint, setSelectedComplaint } = useComplaints();
  const { filters, handleFilterChange, filteredComplaints } = useComplaintFilters(complaints);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const handleDeleteConfirm = async () => {
    if (!selectedRNC) return;
    
    try {
      await rncService.delete(selectedRNC.id);
      toast.success("RNC excluída com sucesso!");
      
      // Remove the deleted RNC from the list
      const updatedComplaints = complaints.filter(c => c.id.toString() === selectedRNC.id);
      setComplaints(updatedComplaints);
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      setSelectedRNC(null);
    } catch (error) {
      console.error('Error deleting RNC:', error);
      toast.error("Erro ao excluir RNC");
    }
  };

  // Convert complaints to RNC format for the table
  const complaintRNCs = filteredComplaints.map(complaint => ({
    id: complaint.id.toString(),
    rnc_number: parseInt(complaint.protocol),
    company: complaint.company,
    description: complaint.description,
    type: RncTypeEnum.company_complaint,
    workflow_status: WorkflowStatusEnum.open,
    department: RncDepartmentEnum.logistics,
    status: RncStatusEnum.pending,
    created_by: "",
    created_at: complaint.date,
    updated_at: new Date().toISOString(),
    company_code: "",
    document: "",
    assigned_by: null,
    assigned_to: null,
    assigned_at: null,
    closed_at: null,
    responsible: "",
    days_left: complaint.daysOpen,
    korp: "",
    nfv: "",
    nfd: null,
    collected_at: null,
    city: "",
    conclusion: ""
  } as RNC));

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
            complaints={complaintRNCs}
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
