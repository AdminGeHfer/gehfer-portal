import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { RNCDetailHeader } from "./RNCDetailHeader";
import { RNCDetailForm } from "./RNCDetailForm";
import { RNCCommentSection } from "./RNCCommentSection";
import { RNCAttachments } from "./RNCAttachments";
import { RNCWorkflowStatus } from "../workflow/RNCWorkflowStatus";
import { RNCWorkflowHistory } from "../workflow/RNCWorkflowHistory";
import { RNCCompanyInfo } from "./sections/RNCCompanyInfo";
import { RNCContactInfo } from "./sections/RNCContactInfo";
import { RNCHeader } from "./sections/RNCHeader";
import { RNC } from "@/types/rnc";
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
  onStatusChange: (status: string) => void;
}

export function RNCDetailLayout({
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
  onStatusChange,
}: RNCDetailLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Card className="p-6">
            <RNCHeader
              rnc={rnc}
              canEdit={canEdit}
              isEditing={isEditing}
              onEdit={onEdit}
              onSave={onSave}
              onPrint={onPrint}
              onWhatsApp={onWhatsApp}
              onStatusChange={onStatusChange}
              onRefresh={onRefresh}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              onCollectionRequest={() => {}}
            />
          </Card>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
              <RNCCompanyInfo rnc={rnc} />
              
              <Card className="p-6">
                <RNCDetailForm 
                  rnc={rnc}
                  isEditing={isEditing}
                  onFieldChange={onFieldChange}
                />
              </Card>

              <RNCContactInfo rnc={rnc} />

              <Card className="p-6">
                <RNCAttachments rncId={rnc.id} />
              </Card>

              <Card className="p-6">
                <RNCCommentSection 
                  rncId={rnc.id}
                  onCommentAdded={onRefresh}
                />
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="p-6">
                <RNCWorkflowStatus 
                  rncId={rnc.id}
                  currentStatus={rnc.workflow_status || "open"}
                  onStatusChange={onStatusChange}
                />
              </Card>

              <Card className="p-6">
                <RNCWorkflowHistory rncId={rnc.id} />
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}