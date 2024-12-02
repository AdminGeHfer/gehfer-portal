import { Button } from "@/components/ui/button";
import { RNCDetailForm } from "./RNCDetailForm";
import { RNCDetailHeader } from "./RNCDetailHeader";
import { RNCDeleteDialog } from "./RNCDeleteDialog";
import { RNCTimeline } from "../RNCTimeline";
import { RNCPrintLayout } from "../RNCPrintLayout";
import { RNCComments } from "./RNCComments";
import { RNCAttachments } from "./RNCAttachments";
import { RNC } from "@/types/rnc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { CollectionRequestDialog } from "../collection/CollectionRequestDialog";
import { CollectionDetails } from "../collection/CollectionDetails";
import { RNCWorkflowStatus } from "../workflow/RNCWorkflowStatus";

interface RNCDetailLayoutProps {
  rnc: RNC;
  id: string;
  isEditing: boolean;
  isPrinting: boolean;
  isDeleteDialogOpen: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onPrint: () => void;
  onWhatsApp: () => void;
  onFieldChange: (field: keyof RNC, value: any) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isDeleting: boolean;
  canEdit: boolean;
  onRefresh: () => void;
}

export function RNCDetailLayout({
  rnc,
  id,
  isEditing,
  isPrinting,
  isDeleteDialogOpen,
  onEdit,
  onSave,
  onDelete,
  onPrint,
  onWhatsApp,
  onFieldChange,
  setIsDeleteDialogOpen,
  isDeleting,
  canEdit,
  onRefresh,
}: RNCDetailLayoutProps) {
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (isPrinting) {
      window.print();
    }
  }, [isPrinting]);

  if (isPrinting) {
    return <RNCPrintLayout rnc={rnc} />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <RNCDetailHeader
        rnc={rnc}
        onEdit={onEdit}
        onSave={onSave}
        onDelete={onDelete}
        onPrint={onPrint}
        onWhatsApp={onWhatsApp}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isEditing={isEditing}
        canEdit={canEdit}
        onStatusChange={(status) => onFieldChange('status', status)}
        onRefresh={onRefresh}
        onCollectionRequest={() => setIsCollectionDialogOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="collections">Coletas</TabsTrigger>
              <TabsTrigger value="attachments">Anexos</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <RNCDetailForm
                rnc={rnc}
                isEditing={isEditing}
                onFieldChange={onFieldChange}
              />
            </TabsContent>
            <TabsContent value="collections">
              <CollectionDetails rncId={id} onStatusUpdate={onRefresh} showEvidence />
            </TabsContent>
            <TabsContent value="attachments">
              <RNCAttachments rncId={id} onUpdate={onRefresh} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <RNCWorkflowStatus
            rncId={id}
            currentStatus={rnc.workflow_status || 'open'}
            onStatusChange={onRefresh}
          />

          <Tabs defaultValue="comments">
            <TabsList className="w-full">
              <TabsTrigger value="comments" className="flex-1">Comentários</TabsTrigger>
              <TabsTrigger value="timeline" className="flex-1">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="comments">
              <RNCComments rncId={id} onCommentAdded={onRefresh} />
            </TabsContent>
            <TabsContent value="timeline">
              <RNCTimeline events={rnc.timeline} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CollectionRequestDialog
        rncId={id}
        open={isCollectionDialogOpen}
        onOpenChange={setIsCollectionDialogOpen}
      />

      <RNCDeleteDialog
        isOpen={isDeleteDialogOpen}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}