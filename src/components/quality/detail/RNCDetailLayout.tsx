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
      <main className="container mx-auto py-4">
        <div className="mb-6">
          <BackButton to="/quality/rnc" />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Workflow Status - Destacado */}
          <div className="lg:col-span-3 lg:order-2">
            <div className="sticky top-4 space-y-4">
              <Card className="p-4 bg-white/80 backdrop-blur-sm border-primary/10 shadow-lg hover:shadow-xl transition-all duration-200">
                <RNCWorkflowStatus 
                  rncId={id}
                  currentStatus={workflowStatus || "open"}
                  onStatusChange={onStatusChange}
                />
              </Card>
              
              <Card className="p-4 bg-white/60 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200">
                <RNCWorkflowHistory rncId={id} />
              </Card>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-9 lg:order-1 space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
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
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <RNCDetailForm 
                rnc={rnc}
                isEditing={isEditing}
                onFieldChange={onFieldChange}
              />
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <RNCAttachments rncId={id} />
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <RNCCommentSection 
                rncId={id}
                onCommentAdded={onRefresh}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RNCDetailLayout;