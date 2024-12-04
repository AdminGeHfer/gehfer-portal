import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { RNCDetailHeader } from "./RNCDetailHeader";
import { RNCDetailForm } from "./RNCDetailForm";
import { RNCCommentSection } from "./RNCCommentSection";
import { RNCAttachments } from "./RNCAttachments";
import { RNCWorkflowStatus } from "../workflow/RNCWorkflowStatus";
import { RNCWorkflowHistory } from "../workflow/RNCWorkflowHistory";
import { BackButton } from "@/components/atoms/BackButton";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNC, WorkflowStatusEnum } from "@/types/rnc";
import { toast } from "sonner";
import { RefetchOptions } from "@tanstack/react-query";

interface RNCDetailLayoutProps {
  rnc: RNC;
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
  onRefresh: (options?: RefetchOptions) => Promise<void>;
  onStatusChange: (newStatus: WorkflowStatusEnum) => Promise<void>;
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
  onRefresh,
  onStatusChange
}: RNCDetailLayoutProps) => {
  const { id } = useParams();
  if (!id) return <Navigate to="/quality/rnc" replace />;

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

        if (error) throw error;
        
        if (!data || data.length === 0) {
          return rnc.workflow_status;
        }

        return data[0].to_status as WorkflowStatusEnum;
      } catch (error) {
        console.error("Error in workflow status query:", error);
        return rnc.workflow_status;
      }
    },
    enabled: !!rnc
  });

  if (!rnc) {
    return <Navigate to="/quality/rnc" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 space-y-6">
        <BackButton to="/quality/rnc" />
        
        <div className="space-y-6">
          <Card className="p-6 shadow-sm bg-white/50 backdrop-blur-sm">
            <RNCDetailHeader 
              rnc={rnc}
              isEditing={isEditing}
              canEdit={canEdit}
              onEdit={onEdit}
              onSave={onSave}
              onDelete={onDelete}
              onPrint={onPrint}
              onWhatsApp={onWhatsApp}
              onStatusChange={onStatusChange}
              onRefresh={onRefresh}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              isDeleteDialogOpen={isDeleteDialogOpen}
              isDeleting={isDeleting}
            />
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <RNCDetailForm 
                  rnc={rnc}
                  isEditing={isEditing}
                  onFieldChange={onFieldChange}
                />
              </Card>

              <Card className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <RNCAttachments rncId={id} />
              </Card>

              <Card className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <RNCCommentSection 
                  rncId={id}
                  onCommentAdded={onRefresh}
                />
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white/50 backdrop-blur-sm">
                <RNCWorkflowStatus 
                  rncId={id}
                  currentStatus={workflowStatus || "open"}
                  onStatusChange={onStatusChange}
                />
              </Card>

              <Card className="p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                <RNCWorkflowHistory rncId={id} />
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RNCDetailLayout;