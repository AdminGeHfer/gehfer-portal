import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { RNCDetailHeader } from "./RNCDetailHeader";
import { RNCDetailForm } from "./RNCDetailForm";
import { RNCCommentSection } from "./RNCCommentSection";
import { RNCAttachments } from "./RNCAttachments";
import { RNCWorkflowStatus } from "../workflow/RNCWorkflowStatus";
import { BackButton } from "@/components/atoms/BackButton";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { toast } from "sonner";

interface RNCDetailLayoutProps {
  rnc: RNC;
  id?: string;
  isEditing: boolean;
  isPrinting: boolean;
  isDeleteDialogOpen: boolean;
  isDeleting: boolean;
  canEdit: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onPrint: () => void;
  onWhatsApp: () => void;
  onFieldChange: (field: keyof RNC, value: any) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  onRefresh: () => void;
}

export const RNCDetailLayout = ({
  rnc,
  isEditing,
  isPrinting,
  isDeleteDialogOpen,
  isDeleting,
  canEdit,
  onEdit,
  onSave,
  onDelete,
  onPrint,
  onWhatsApp,
  onFieldChange,
  setIsDeleteDialogOpen,
  onRefresh
}: RNCDetailLayoutProps) => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;

  const { data: workflowStatus } = useQuery({
    queryKey: ["workflow-status", id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("rnc_workflow_transitions")
          .select("*")
          .eq("rnc_id", id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching workflow status:", error);
          return "open" as WorkflowStatusEnum;
        }

        // If no transitions exist yet, return default status
        if (!data || data.length === 0) {
          return "open" as WorkflowStatusEnum;
        }

        return data[0].to_status as WorkflowStatusEnum;
      } catch (error) {
        console.error("Error in workflow status query:", error);
        return "open" as WorkflowStatusEnum;
      }
    }
  });

  const handleStatusChange = async (newStatus: WorkflowStatusEnum) => {
    try {
      const { error } = await supabase
        .from("rncs")
        .update({ workflow_status: newStatus })
        .eq("id", id);

      if (error) throw error;
      
      onRefresh();
      toast.success("Status atualizado com sucesso");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <BackButton to="/quality/rnc" label="Voltar para Lista de RNCs" />
        
        <div className="space-y-8">
          <Card className="p-6">
            <RNCDetailHeader 
              rnc={rnc}
              isEditing={isEditing}
              canEdit={canEdit}
              onEdit={onEdit}
              onSave={onSave}
              onDelete={onDelete}
              onPrint={onPrint}
              onWhatsApp={onWhatsApp}
              onStatusChange={handleStatusChange}
              onRefresh={onRefresh}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              onCollectionRequest={() => {}}
            />
          </Card>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
              <Card className="p-6">
                <RNCDetailForm 
                  rnc={rnc}
                  isEditing={isEditing}
                  onFieldChange={onFieldChange}
                />
              </Card>

              <Card className="p-6">
                <RNCAttachments rncId={id} />
              </Card>

              <Card className="p-6">
                <RNCCommentSection 
                  rncId={id}
                  onCommentAdded={onRefresh}
                />
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="p-6">
                <RNCWorkflowStatus 
                  rncId={id}
                  currentStatus={workflowStatus || "open"}
                  onStatusChange={handleStatusChange}
                />
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RNCDetailLayout;