import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "@/components/rnc/tabs/details/BasicInfoTab";
import { AdditionalInfoTab } from "@/components/rnc/tabs/details/AdditionalInfoTab";
import { RelationalInfoTab } from "@/components/rnc/tabs/details/RelationalInfoTab";
import { WorkflowTab } from "@/components/rnc/tabs/details/WorkflowTab";
import { EventsTimeline } from "@/components/rnc/details/EventsTimeline";
import { toast } from "sonner";
import { StatusBadge } from "@/components/quality/StatusBadge";
import { useRNCDetails } from "@/hooks/useRNCDetails";
import { useRNCRealtime } from '@/hooks/useRNCRealtime';

export default function RNCDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { rnc, loading, refetch } = useRNCDetails(id);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState("basic");
  const basicInfoRef = React.useRef<{ validate: () => Promise<boolean> }>(null);
  const relationalInfoRef = React.useRef<{ validate: () => Promise<boolean> }>(null);
  const additionalInfoRef = React.useRef<{ validate: () => Promise<boolean> }>(null);

  useRNCRealtime(refetch);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 flex items-center justify-center">
        <div>Carregando detalhes...</div>
      </div>
    );
  }

  if (!rnc) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 flex items-center justify-center">
        <div>RNC não encontrada</div>
      </div>
    );
  }

  const handleTabChange = async (value: string) => {
    if (isEditing) {
      let isValid = true;
      
      // Validate current tab before switching
      switch (currentTab) {
        case "basic":
          isValid = await basicInfoRef.current?.validate() || false;
          break;
        case "relational":
          isValid = await relationalInfoRef.current?.validate() || false;
          break;
        case "additional":
          isValid = await additionalInfoRef.current?.validate() || false;
          break;
      }

      if (!isValid) {
        toast.error("Por favor, preencha todos os campos obrigatórios antes de continuar.");
        return;
      }
    }
    
    setCurrentTab(value);
  };

  const handleSave = async () => {
    let isValid = true;

    // Validate all tabs before saving
    switch (currentTab) {
      case "basic":
        isValid = await basicInfoRef.current?.validate() || false;
        break;
      case "relational":
        isValid = await relationalInfoRef.current?.validate() || false;
        break;
      case "additional":
        isValid = await additionalInfoRef.current?.validate() || false;
        break;
    }

    if (!isValid) {
      toast.error("Por favor, preencha todos os campos obrigatórios antes de salvar.");
      return;
    }

    setIsEditing(false);
    toast.success("RNC atualizada com sucesso!");
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="container mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/quality/home")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">RNC #{rnc.rnc_number}</h1>
          <StatusBadge status={rnc.status} />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tabs section */}
          <div className="lg:col-span-2">
            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full grid grid-cols-2 sm:flex sm:flex-wrap gap-1 p-1 rounded-lg border border-border bg-background">
                <div className="contents sm:flex sm:flex-1 w-full">
                  <TabsTrigger 
                    value="basic" 
                    className="w-full flex-1 min-w-[120px] bg-muted text-muted-foreground hover:bg-muted/90 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                  >
                    Informações base
                  </TabsTrigger>
                  <TabsTrigger 
                    value="additional" 
                    className="w-full flex-1 min-w-[120px] bg-muted text-muted-foreground hover:bg-muted/90 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                  >
                    Inf. Adicionais
                  </TabsTrigger>
                </div>
                <div className="contents sm:flex sm:flex-1 w-full">
                  <TabsTrigger 
                    value="relational" 
                    className="w-full flex-1 min-w-[120px] bg-muted text-muted-foreground hover:bg-muted/90 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                  >
                    Inf. Relacionais
                  </TabsTrigger>
                  <TabsTrigger 
                    value="workflow" 
                    className="w-full flex-1 min-w-[120px] bg-muted text-muted-foreground hover:bg-muted/90 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                  >
                    Workflow
                  </TabsTrigger>
                </div>
              </TabsList>

              <TabsContent value="basic" className="space-y-6 p-4">
                <BasicInfoTab ref={basicInfoRef} isEditing={isEditing} initialValues={{
                  companyCode: rnc.company_code,
                  company: rnc.company,
                  document: rnc.cnpj,
                  type: rnc.type,
                  department: rnc.department,
                  responsible: rnc.responsible?.toLocaleLowerCase()}}
                />
              </TabsContent>

              <TabsContent value="additional" className="space-y-6 p-4">
                <AdditionalInfoTab ref={additionalInfoRef} isEditing={isEditing} initialValues={{
                  description: rnc.description,
                  korp: rnc.korp,
                  nfv: rnc.nfv,
                  nfd: rnc.nfd,
                  city: rnc.city,
                  conclusion: rnc.conclusion,
                  collected_at: rnc.collected_at,
                  closed_at: rnc.closed_at}}
                />
              </TabsContent>

              <TabsContent value="relational" className="space-y-6 p-4">
                <RelationalInfoTab ref={relationalInfoRef} isEditing={isEditing} rncId={rnc.id}
                  initialValues={{
                    name: rnc.contacts?.[0]?.name || '',
                    phone: rnc.contacts?.[0]?.phone || '',
                    email: rnc.contacts?.[0]?.email || '',
                    products: rnc.products?.map(p => ({
                      id: p.id,
                      name: p.name,
                      weight: p.weight
                    })) || [{ id: crypto.randomUUID(), name: '', weight: 0.1 }],
                    attachments: rnc.attachments
                  }}
                />
              </TabsContent>

              <TabsContent value="workflow" className="space-y-6 p-4">
                <WorkflowTab
                  rncId={rnc.id}
                  transitions={rnc.workflow_transitions}
                  isEditing={isEditing}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-card rounded-lg p-4 h-[calc(100vh-12rem)] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Histórico (Eventos)</h2>
            <EventsTimeline
              events={rnc.events}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t pt-4 flex-wrap gap-4">
          <span className="text-sm text-muted-foreground text-red-500">
            * Campos obrigatórios
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              {isEditing ? "Salvar" : "Editar"}
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={() => {
                // Handle delete
              }}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
