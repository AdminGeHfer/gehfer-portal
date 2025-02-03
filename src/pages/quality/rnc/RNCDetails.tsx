import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRNCDetails } from '@/hooks/useRNCDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab, BasicInfoTabRef } from "@/components/rnc/tabs/details/BasicInfoTab";
import { RelationalInfoTab, RelationalInfoTabRef } from "@/components/rnc/tabs/details/RelationalInfoTab";
import { AdditionalInfoTab, AdditionalInfoTabRef } from "@/components/rnc/tabs/details/AdditionalInfoTab";
import { WorkflowTab } from "@/components/rnc/tabs/details/WorkflowTab";
import { EventsTimeline } from "@/components/rnc/details/EventsTimeline";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { rncService } from "@/services/rncService";
import { DeleteRNCDialog } from "@/components/rnc/DeleteRNCDialog";
import { BackButton } from '@/components/atoms/BackButton';
import { RNCAttachment, RncStatusEnum, WorkflowStatusEnum } from '@/types/rnc';

const RNCDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { rnc, loading, refetch } = useRNCDetails(id!);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Refs for form validation
  const basicInfoRef = useRef<BasicInfoTabRef>(null);
  const relationalInfoRef = useRef<RelationalInfoTabRef>(null);
  const additionalInfoRef = useRef<AdditionalInfoTabRef>(null);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Get current form data from refs instead of localStorage
      const basicData = basicInfoRef.current?.getFormData();
      const additionalData = additionalInfoRef.current?.getFormData();
      const relationalData = relationalInfoRef.current?.getFormData();

      // Validate all forms
      const [basicValid, additionalValid, relationalValid] = await Promise.all([
        basicInfoRef.current?.validate() || Promise.resolve(false),
        additionalInfoRef.current?.validate() || Promise.resolve(false),
        relationalInfoRef.current?.validate() || Promise.resolve(false),
      ]);

      console.log('Refs:', {
        basic: basicInfoRef.current,
        additional: additionalInfoRef.current,
        relational: relationalInfoRef.current
      });

      console.log('Basic data:', basicInfoRef.current?.getFormData());
      console.log('Additional data:', additionalInfoRef.current?.getFormData());
      console.log('Relational data:', relationalInfoRef.current?.getFormData());

      if (!basicData || !additionalData || !relationalData) {
        toast.error("Erro ao obter dados dos formulários");
        return;
      }

      if (!basicValid || !additionalValid || !relationalValid) {
        toast.error("Por favor, corrija os erros antes de salvar");
        return;
      }

      // Get form data from localStorage
      const storedData = localStorage.getItem('rncDetailsData');
      if (!storedData) {
        toast.error("Nenhum dado para salvar");
        return;
      }
      
      if (!id) {
        toast.error("ID da RNC não encontrado");
        return;
      }

      // Update RNC
      const updatedData = {
        company_code: basicData.company_code,
        company: basicData.company,
        document: basicData.document,
        type: basicData.type,
        department: basicData.department,
        responsible: basicData.responsible,
        description: additionalData.description,
        korp: additionalData.korp || "",
        nfv: additionalData.nfv || "",
        nfd: additionalData.nfd,
        city: additionalData.city,
        collected_at: additionalData.collected_at,
        closed_at: additionalData.closed_at,
        conclusion: additionalData.conclusion,
        assigned_by: rnc?.assigned_by || "",
        contacts: relationalData.contacts.map(contact => ({
          name: contact.name,
          phone: contact.phone,
          email: contact.email || ""
        })),
        products: relationalData.products.map(product => ({
          name: product.name,
          weight: product.weight
        })),
        attachments: relationalData.attachments?.map(attachment => {
          // If it's already an RNCAttachment object (from database)
          if ('rnc_id' in attachment) {
            return attachment;
          }
          // If it's a File object (newly uploaded)
          if (attachment instanceof File) {
            // This case should be handled by the FileUploadField component
            // The actual attachment object will be managed by the state
            // So this case shouldn't occur in the update
            return null;
          }
          // Return null for any other case
          return null;
        }).filter(Boolean) as RNCAttachment[] || [],
        status: rnc?.status || RncStatusEnum.pending,
        workflow_status: rnc?.workflow_status || WorkflowStatusEnum.open,
        updated_at: new Date().toISOString()
      };

      await rncService.update(id, updatedData);

      toast.success("RNC atualizada com sucesso!");
      setIsEditing(false);
      refetch();

    } catch (error) {
      console.error('Error saving RNC:', error);
      toast.error("Erro ao salvar RNC");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!id) {
        toast.error("ID da RNC não encontrado");
        return;
      }

      await rncService.delete(id);

      navigate('/quality/home', { replace: true });
    } catch (error) {
      console.error('Error deleting RNC:', error);
      toast.error("Erro ao excluir RNC");
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
      <div className="mb-6">
        <BackButton to="/quality/home" />
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">RNC #{rnc.rnc_number}</h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="default"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background border rounded-lg shadow">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="w-full flex flex-wrap justify-start border-b rounded-none p-0 h-auto bg-muted">
                <div className="flex w-full md:w-1/2">
                  <TabsTrigger
                    value="basic"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
                  >
                    Inf. Básicas
                  </TabsTrigger>
                  <TabsTrigger
                    value="additional"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
                  >
                    Inf. Adicionais
                  </TabsTrigger>
                  <TabsTrigger
                    value="relational"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
                  >
                    Inf. Relacionais
                  </TabsTrigger>
                  <TabsTrigger
                    value="workflow"
                    className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
                  >
                    Workflow
                  </TabsTrigger>
                </div>
              </TabsList>

              <div className="bg-background p-4 rounded-b-lg">
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

                <TabsContent value="relational">
                  <RelationalInfoTab
                    ref={relationalInfoRef}
                    rncId={rnc.id}
                    isEditing={isEditing}
                    initialValues={{
                      contacts: rnc.contacts,
                      products: rnc.products,
                      attachments: rnc.attachments,
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
              </div>
            </Tabs>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-background border rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Timeline de Eventos</h2>
            <EventsTimeline events={rnc.events} />
          </div>
        </div>
      </div>

      <DeleteRNCDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        rncId={rnc.id}
        rncNumber={rnc.rnc_number}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default RNCDetailsPage;
