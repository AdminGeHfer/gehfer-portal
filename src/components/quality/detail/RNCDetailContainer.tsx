import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRNCDetail } from "@/hooks/useRNCDetail";
import { RNCDetailLayout } from "./RNCDetailLayout";
import { RNCDetailHeader } from "./RNCDetailHeader";
import { RNCDetailContent } from "./RNCDetailContent";
import { RNCTimeline } from "../RNCTimeline";
import { RNCStatusBadge } from "@/components/molecules/RNCStatusBadge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export function RNCDetailContainer() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get id from URL params
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    rnc,
    isLoading,
    handleDelete,
    handleStatusChange,
    handleFieldChange,
    handleRefresh
  } = useRNCDetail(id!);

  const handleGeneratePDF = () => {
    setIsGeneratingPDF(!isGeneratingPDF);
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
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-3">
              RNC #{rnc.rnc_number}
              <RNCStatusBadge status={rnc.workflow_status} />
            </h1>
            <p className="text-sm text-muted-foreground">
              Criado em {format(new Date(rnc.created_at), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="empresa" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="empresa">Empresa</TabsTrigger>
                <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                <TabsTrigger value="contato">Contato</TabsTrigger>
              </TabsList>
              <TabsContent value="empresa" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Razão Social</label>
                    <p className="text-lg">{rnc.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">CNPJ</label>
                    <p className="text-lg">{rnc.cnpj}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nº do Pedido</label>
                    <p className="text-lg">{rnc.order_number || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nº da Devolução</label>
                    <p className="text-lg">{rnc.return_number || "-"}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="detalhes" className="space-y-4 mt-4">
                <RNCDetailContent
                  rnc={rnc}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                  onRefresh={handleRefresh}
                  onStatusChange={handleStatusChange}
                />
              </TabsContent>
              <TabsContent value="contato" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <p className="text-lg">{rnc.contact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Telefone</label>
                    <p className="text-lg">{rnc.contact.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-lg">{rnc.contact.email}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Histórico do Workflow</h2>
              <RNCTimeline rncId={rnc.id} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Status do Workflow</h2>
              <div className="space-y-4">
                <RNCStatusBadge status={rnc.workflow_status} />
                <Textarea
                  className="w-full min-h-[100px]"
                  placeholder="Notas sobre a transição (opcional)"
                />
                <Button
                  className="w-full"
                  onClick={() => handleStatusChange("analysis")}
                >
                  Em Análise
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}