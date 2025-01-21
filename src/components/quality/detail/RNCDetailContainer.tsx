import { useState } from "react";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRNCDetail } from "@/hooks/useRNCDetail";
import { RNCTimeline } from "../RNCTimeline";
import { RNCStatusBadge } from "@/components/molecules/RNCStatusBadge";
import { Textarea } from "@/components/ui/textarea";
import { RNCReportPreview } from "../report/RNCReportPreview";
import { RNCDetailForm } from "./RNCDetailForm";
import { RNCDetailActions } from "./RNCDetailActions";
import { RNCDeleteDialog } from "./RNCDeleteDialog";
import { useDeleteRNC } from "@/components/mutations/rncMutations";
import { BackButton } from "@/components/atoms/BackButton";
import { WorkflowStatusBadge } from "@/components/quality/workflow/status/WorkflowStatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RNCDetailContainer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEditing] = useState(false);
  const [transitionNotes, setTransitionNotes] = useState("");

  const {
    rnc,
    isLoading,
    handleFieldChange,
    handleEdit,
    handleSave,
  } = useRNCDetail(id!);

  console.log("RNC data in RNCDetailContainer:", rnc);

  const deleteMutation = useDeleteRNC(id!, () => {
    navigate("/quality/rnc");
  });

  const handleDelete = () => {
    console.log('Handling delete for RNC:', id);
    deleteMutation.mutate();
  };

  const handleGeneratePDF = () => {
    if (!rnc) return;
    setIsGeneratingPDF(true);
  };

  const handleWhatsApp = () => {
    if (!rnc) return;
    const text = `RNC #${rnc.rnc_number}\nEmpresa: ${rnc.company}\nDescrição: ${rnc.description}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (isLoading || !rnc) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen">
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">{isLoading ? "Carregando..." : "RNC não encontrada"}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <BackButton to="/quality/rnc" label="Voltar para RNCs" />
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-foreground">
              RNC #{rnc.rnc_number}
            </h1>
            <RNCStatusBadge status={rnc.status} />
          </div>
          <RNCDetailActions
            rnc={rnc}
            canEdit={rnc.canEdit}
            isEditing={isEditing}
            onEdit={handleEdit}
            onSave={handleSave}
            onDelete={() => setIsDeleteDialogOpen(true)}
            onPrint={handleGeneratePDF}
            onWhatsApp={handleWhatsApp}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            isDeleting={deleteMutation.isPending}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RNCDetailForm
              rnc={rnc}
              isEditing={isEditing}
              onFieldChange={handleFieldChange}
              onSave={handleSave}
            />

            {/* Products Table */}
            <div className="bg-background rounded-lg border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Produtos</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Peso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rnc.products && rnc.products.length > 0 ? (
                    rnc.products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.product}</TableCell>
                        <TableCell>{product.weight}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        Nenhum produto registrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="bg-background rounded-lg border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Histórico do Workflow</h2>
              <RNCTimeline rncId={rnc.id} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-background rounded-lg border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Status do Workflow</h2>
              <div className="space-y-4">
                <WorkflowStatusBadge status={rnc.workflow_status} />
                <Textarea
                  className="w-full min-h-[100px]"
                  placeholder="Notas sobre a transição (opcional)"
                  value={transitionNotes}
                  onChange={(e) => setTransitionNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <RNCDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDelete}
          isDeleting={deleteMutation.isPending}
        />

        {isGeneratingPDF && (
          <RNCReportPreview
            rnc={rnc}
            onClose={() => setIsGeneratingPDF(false)}
          />
        )}
      </main>
    </div>
  );
}