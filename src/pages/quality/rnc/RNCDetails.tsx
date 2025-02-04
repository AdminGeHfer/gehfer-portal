import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "@/components/rnc/tabs/details/BasicInfoTab";
import { AdditionalInfoTab } from "@/components/rnc/tabs/details/AdditionalInfoTab";
import { RelationalInfoTab } from "@/components/rnc/tabs/details/RelationalInfoTab";
import { WorkflowTab } from "@/components/rnc/tabs/details/WorkflowTab";
import { Button } from "@/components/ui/button";
import { Edit, Save, Trash2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useRNCDetails } from "@/hooks/useRNCDetails";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateRNCFormData, updateRNCSchema } from "@/schemas/rncValidation";
import { BackButton } from "@/components/atoms/BackButton";
import { EventsTimeline } from "@/components/rnc/details/EventsTimeline";
import { DeleteRNCDialog } from "@/components/rnc/DeleteRNCDialog";
import { toast } from "sonner";
import { rncService } from "@/services/rncService";
import { RncStatusEnum, WorkflowStatusEnum, type RNCAttachment } from "@/types/rnc";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// interface RNCDetailsProps {
//   id?: string;
//   onClose?: () => void;
// }

export function RNCDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rnc, loading, error, refetch } = useRNCDetails(id!);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const methods = useForm<UpdateRNCFormData>({
    resolver: zodResolver(updateRNCSchema),
    defaultValues: {
      company_code: '',
      company: '',
      document: '',
      type: undefined,
      department: undefined,
      responsible: '',
      description: '',
      korp: '',
      nfv: '',
      nfd: '',
      city: '',
      collected_at: null,
      closed_at: null,
      conclusion: '',
      contacts: [],
      products: [],
      attachments: []
    }
  });

  React.useEffect(() => {
    if (rnc) {
      methods.reset({
        company_code: rnc.company_code,
        company: rnc.company,
        document: rnc.document,
        type: rnc.type,
        department: rnc.department,
        responsible: rnc.responsible || '',
        description: rnc.description,
        korp: rnc.korp || '',
        nfv: rnc.nfv || '',
        nfd: rnc.nfd || '',
        city: rnc.city || '',
        collected_at: rnc.collected_at ? new Date(rnc.collected_at).toLocaleDateString("pt-BR") : null,
        closed_at: rnc.closed_at ? new Date(rnc.closed_at).toLocaleDateString("pt-BR") : null,
        conclusion: rnc.conclusion || '',
        contacts: rnc.contacts || [],
        products: rnc.products || [],
        attachments: rnc.attachments || []
      });
    }
  }, [rnc, methods]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (!id) {
        navigate('/quality/home');
        toast.error("ID da RNC não encontrado");
        return;
      }

      if(!rnc) {
        toast.error("Dados da RNC não encontrados")
      }

      const formData = methods.getValues();

      const transformedProducts = formData.products.map(product => ({
        name: product.name || '',
        weight: Number(product.weight) || 0
      }));

      const transformedContacts = formData.contacts.map(contact => ({
        name: contact.name || '',
        phone: contact.phone || '',
        email: contact.email || ''
      }));

      // Update RNC
      const updatedData = {
        company_code: formData.company_code,
        company: formData.company,
        document: formData.document,
        type: formData.type,
        department: formData.department,
        responsible: formData.responsible,
        description: formData.description,
        korp: formData.korp || "",
        nfv: formData.nfv || "",
        nfd: formData.nfd || "",
        city: formData.city,
        collected_at: formData.collected_at,
        closed_at: formData.closed_at,
        conclusion: formData.conclusion,
        assigned_by: rnc.assigned_by || "",
        contacts: transformedContacts,
        products: transformedProducts,
        status: rnc?.status || RncStatusEnum.pending,
        workflow_status: rnc?.workflow_status || WorkflowStatusEnum.open,
        updated_at: new Date().toISOString(),
        attachments: formData.attachments?.map(attachment => {
          if ('rnc_id' in attachment) return attachment;
          return null;
        }).filter(Boolean) as RNCAttachment[] || [],
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !rnc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-red-500">Erro ao carregar RNC</p>
        <Button onClick={() => navigate('/quality/home')}>
          Voltar para listagem
        </Button>
      </div>
    );
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

      <FormProvider {...methods}>
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
                      isEditing={isEditing}
                    />
                  </TabsContent>

                  <TabsContent value="additional">
                    <AdditionalInfoTab
                      isEditing={isEditing}
                    />
                  </TabsContent>

                  <TabsContent value="relational">
                    <RelationalInfoTab
                      rncId={rnc.id}
                      isEditing={isEditing}
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
      </FormProvider>

      <DeleteRNCDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        rncId={rnc.id}
        rncNumber={rnc.rnc_number}
        onConfirm={handleDelete}
      />
    </div>
  );
}
