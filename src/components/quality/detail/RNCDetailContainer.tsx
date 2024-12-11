import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRNCDetail } from "@/hooks/useRNCDetail";
import { RNCTimeline } from "../RNCTimeline";
import { RNCStatusBadge } from "@/components/molecules/RNCStatusBadge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FilePdf, WhatsappLogo, PencilSimple, Trash } from "@phosphor-icons/react";
import { toast } from "sonner";

export function RNCDetailContainer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [transitionNotes, setTransitionNotes] = useState("");

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

  const handleWhatsApp = () => {
    toast.info("Funcionalidade em desenvolvimento");
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
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">
              RNC #{rnc.rnc_number}
            </h1>
            <RNCStatusBadge status={rnc.workflow_status} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGeneratePDF}>
              <FilePdf weight="fill" className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={handleWhatsApp}>
              <WhatsappLogo weight="fill" className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            {rnc.canEdit && (
              <>
                <Button 
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <PencilSimple className="w-4 h-4 mr-2" />
                  {isEditing ? "Salvar" : "Editar"}
                </Button>
                <Button 
                  variant="outline" 
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border shadow-sm">
              <Tabs defaultValue="empresa" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="empresa">Empresa</TabsTrigger>
                  <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                  <TabsTrigger value="contato">Contato</TabsTrigger>
                </TabsList>
                <TabsContent value="empresa" className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Razão Social</label>
                      <p className="text-lg">{rnc.company}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">CNPJ</label>
                      <p className="text-lg">{rnc.cnpj}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nº do Pedido</label>
                      <p className="text-lg">{rnc.order_number || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nº da Devolução</label>
                      <p className="text-lg">{rnc.return_number || "-"}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="detalhes" className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Descrição</label>
                      <p className="text-lg">{rnc.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Departamento</label>
                      <p className="text-lg">{rnc.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Prioridade</label>
                      <p className="text-lg capitalize">{rnc.priority}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="contato" className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nome</label>
                      <p className="text-lg">{rnc.contact.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Telefone</label>
                      <p className="text-lg">{rnc.contact.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-lg">{rnc.contact.email}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Histórico do Workflow</h2>
              <RNCTimeline rncId={rnc.id} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Status do Workflow</h2>
              <div className="space-y-4">
                <RNCStatusBadge status={rnc.workflow_status} />
                <Textarea
                  className="w-full min-h-[100px]"
                  placeholder="Notas sobre a transição (opcional)"
                  value={transitionNotes}
                  onChange={(e) => setTransitionNotes(e.target.value)}
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