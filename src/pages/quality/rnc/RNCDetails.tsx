import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useRNCDetails } from '@/hooks/useRNCDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "@/components/rnc/tabs/details/BasicInfoTab";
import { RelationalInfoTab } from "@/components/rnc/tabs/details/RelationalInfoTab";
import { AdditionalInfoTab } from "@/components/rnc/tabs/details/AdditionalInfoTab";
import { WorkflowTab } from "@/components/rnc/tabs/details/WorkflowTab";
import { EventsTimeline } from "@/components/rnc/details/EventsTimeline";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { toast } from "sonner";
import { rncService } from "@/services/rncService";

const RNCDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { rnc, loading, refetch } = useRNCDetails(id!);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Refs for form validation
  const basicInfoRef = useRef<{ validate: () => Promise<boolean> }>(null);
  const relationalInfoRef = useRef<{ validate: () => Promise<boolean> }>(null);
  const additionalInfoRef = useRef<{ validate: () => Promise<boolean> }>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validate all forms
      const [basicValid, relationalValid, additionalValid] = await Promise.all([
        basicInfoRef.current?.validate(),
        relationalInfoRef.current?.validate(),
        additionalInfoRef.current?.validate(),
      ]);

      if (!basicValid || !relationalValid || !additionalValid) {
        toast.error("Por favor, corrija os erros antes de salvar");
        return;
      }

      // Get form data from localStorage
      const storedData = localStorage.getItem('rncDetailsData');
      if (!storedData) {
        toast.error("Nenhum dado para salvar");
        return;
      }

      const formData = JSON.parse(storedData);
      
      // Update RNC
      await rncService.update(id!, {
        ...formData.basic,
        ...formData.relational,
        ...formData.additional,
      });

      toast.success("RNC atualizada com sucesso!");
      setIsEditing(false);
      refetch();

      // Clear stored form data
      localStorage.removeItem('rncDetailsData');
    } catch (error) {
      console.error('Error saving RNC:', error);
      toast.error("Erro ao salvar RNC");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div>Carregando detalhes...</div>;
  }

  if (!rnc) {
    return <div>RNC não encontrada</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">RNC #{rnc.rnc_number}</h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto">
                <TabsTrigger
                  value="basic"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Informações Básicas
                </TabsTrigger>
                <TabsTrigger
                  value="relational"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Informações Relacionais
                </TabsTrigger>
                <TabsTrigger
                  value="additional"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Informações Adicionais
                </TabsTrigger>
                <TabsTrigger
                  value="workflow"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Workflow
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <BasicInfoTab
                  ref={basicInfoRef}
                  isEditing={isEditing}
                  initialValues={{
                    company_code: rnc.company_code,
                    company: rnc.company,
                    document: rnc.document,
                    type: rnc.type,
                    department: rnc.department,
                    responsible: rnc.responsible,
                  }}
                />
              </TabsContent>

              <TabsContent value="relational">
                <RelationalInfoTab
                  ref={relationalInfoRef}
                  rncId={rnc.id}
                  isEditing={isEditing}
                  initialValues={{
                    name: rnc.contacts?.[0]?.name,
                    phone: rnc.contacts?.[0]?.phone,
                    email: rnc.contacts?.[0]?.email,
                    products: rnc.products,
                    attachments: rnc.attachments,
                  }}
                />
              </TabsContent>

              <TabsContent value="additional">
                <AdditionalInfoTab
                  ref={additionalInfoRef}
                  isEditing={isEditing}
                  initialValues={{
                    description: rnc.description,
                    korp: rnc.korp,
                    nfv: rnc.nfv,
                    nfd: rnc.nfd,
                    city: rnc.city,
                    collected_at: rnc.collected_at,
                    closed_at: rnc.closed_at,
                    conclusion: rnc.conclusion,
                  }}
                />
              </TabsContent>

              <TabsContent value="workflow">
                <WorkflowTab
                  rncId={rnc.id}
                  transitions={rnc.workflow_transitions}
                  isEditing={isEditing}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Timeline de Eventos</h2>
            <EventsTimeline events={rnc.events} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RNCDetailsPage;
