import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "@/components/rnc/tabs/details/BasicInfoTab";
import { AdditionalInfoTab } from "@/components/rnc/tabs/details/AdditionalInfoTab";
import { RelationalInfoTab } from "@/components/rnc/tabs/details/RelationalInfoTab";
import { WorkflowTab } from "@/components/rnc/tabs/details/WorkflowTab";
import { Button } from "@/components/ui/button";
import { Edit, Printer, Save, Trash2 } from "lucide-react";
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
import { RncStatusEnum, WorkflowStatusEnum } from "@/types/rnc";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StatusBadge } from "@/components/quality/StatusBadge";
import { RNCPrintContent } from "@/components/rnc/RNCPrintModal";
import { createRoot } from "react-dom/client";
import { generatePDF } from "@/utils/pdfUtils";

interface RNCErrorBoundaryProps {
  children: React.ReactNode;
}

interface RNCErrorBoundaryState {
  hasError: boolean;
}

class RNCErrorBoundary extends React.Component<RNCErrorBoundaryProps, RNCErrorBoundaryState> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('RNC Error:', error, errorInfo);
    toast.error("Erro ao carregar RNC. Por favor, tente novamente.");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-lg text-red-500">Erro ao carregar RNC</p>
          <Button onClick={() => window.location.href = '/quality/home'}>
            Voltar para listagem
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}


interface RNCDetailsProps {
  id?: string;
  onClose?: () => void;
}

function RNCDetails({ id: propId, onClose }: RNCDetailsProps) {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const id = propId || routeId;
  const mounted = React.useRef(false);

  const methods = useForm<UpdateRNCFormData>({
    resolver: zodResolver(updateRNCSchema),
    mode: "onSubmit",
    defaultValues: {
      company_code: '',
      company: '',
      document: '',
      type: undefined,
      department: undefined,
      responsible: '',
      description: '',
      resolution: '',
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

  // Add single reset function
  const handleFormReset = React.useCallback((data = {}) => {
    if (mounted.current) {
      methods.reset(data);
    }
  }, [methods]);

  const handlePrint = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const printContainer = document.createElement('div');
    printContainer.style.padding = '20px';
    let root = null;
    
    try {
      if (!mounted.current) return;

      const formData = methods.getValues();
      
      root = createRoot(printContainer);
      root.render(
        <RNCPrintContent
          rnc={rnc}
          basicInfo={{
            company: formData.company,
            company_code: formData.company_code,
            document: formData.document,
            type: formData.type,
            department: formData.department,
            responsible: formData.responsible
          }}
          additionalInfo={{
            description: formData.description,
            resolution: formData.resolution,
            korp: formData.korp,
            nfv: formData.nfv,
            nfd: formData.nfd,
            city: formData.city,
            collected_at: formData.collected_at,
            closed_at: formData.closed_at,
            conclusion: formData.conclusion
          }}
          relationalInfo={{
            products: rnc.products,
            contacts: rnc.contacts
          }}
          workflowInfo={{
            transitions: rnc.workflow_transitions
          }}
        />
      );

      // Increase wait time for rendering
      await new Promise(resolve => setTimeout(resolve, 500));

      // Only proceed if component is still mounted
      if (mounted.current) {
        await generatePDF({
          filename: `RNC-${rnc.rnc_number}.pdf`,
          element: printContainer
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (mounted.current) {
        toast.error("Erro ao gerar PDF");
      }
    } finally {
      // Always cleanup the root in finally block
      if (root) {
        root.unmount();
      }
    }
  };

  const { handleSubmit } = methods;
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const { rnc, loading, error, refetch } = useRNCDetails(id!);

  // Update mount/unmount handling
  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      handleFormReset();
      setIsEditing(false);
      setIsSaving(false);
      setIsDeleteDialogOpen(false);
    };
  }, [handleFormReset]);

  // Handle browser back button
  React.useEffect(() => {
    const handlePopState = () => {
      if (mounted.current) {
        handleFormReset();
        onClose?.();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose, handleFormReset]);

  // Reset form when RNC data changes
  React.useEffect(() => {
    if (rnc && mounted.current) {
      const formData = {
        company_code: rnc.company_code || '',
        company: rnc.company || '',
        document: rnc.document || '',
        type: rnc.type,
        department: rnc.department,
        responsible: rnc.responsible || '',
        description: rnc.description || '',
        resolution: rnc.resolution || '',
        korp: rnc.korp || '',
        nfv: rnc.nfv || '',
        nfd: rnc.nfd || '',
        city: rnc.city || '',
        collected_at: rnc.collected_at || null,
        closed_at: rnc.closed_at || null,
        conclusion: rnc.conclusion || '',
        contacts: rnc.contacts || [],
        products: rnc.products || [],
        attachments: rnc.attachments || []
      };
      handleFormReset(formData);
    }
  }, [rnc, handleFormReset]);

  // Early returns
  if (!id) {
    navigate('/quality/home');
    return null;
  }

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

  const handleSave = async (data: UpdateRNCFormData) => {
    if (!mounted.current) return;
    
    try {
      setIsSaving(true);

      const transformedProducts = data.products.map(product => ({
        id: product.id,
        name: product.name || '',
        weight: Number(product.weight) || 0,
        rnc_id: id
      }));

      const transformedContacts = data.contacts.map(contact => ({
        name: contact.name || '',
        phone: contact.phone || '',
        email: contact.email || '',
        rnc_id: id
      }));

      const transformedAttachments = data.attachments
        ?.map(attachment => {
          if (attachment instanceof File) return attachment;
          if (!('id' in attachment)) return null;
          
          return {
            id: attachment.id,
            rnc_id: id,
            filename: attachment.filename,
            filesize: attachment.filesize,
            content_type: attachment.content_type,
            file_path: attachment.file_path,
            created_by: attachment.created_by,
            created_at: attachment.created_at
          };
        })
        .filter(Boolean);

      const updatedData = {
        company_code: data.company_code,
        company: data.company,
        document: data.document,
        type: data.type,
        department: data.department,
        responsible: data.responsible,
        description: data.description,
        resolution: data.resolution,
        korp: data.korp || "",
        nfv: data.nfv || "",
        nfd: data.nfd || "",
        city: data.city,
        collected_at: data.collected_at,
        closed_at: data.closed_at,
        conclusion: data.conclusion,
        assigned_by: rnc?.assigned_by || "",
        contacts: transformedContacts,
        products: transformedProducts,
        status: rnc?.status || RncStatusEnum.pending,
        workflow_status: rnc?.workflow_status || WorkflowStatusEnum.open,
        updated_at: new Date().toISOString(),
        attachments: transformedAttachments
      };

      if (mounted.current) {
        await rncService.update(id, updatedData);
        await refetch();
        setIsEditing(false);
        toast.success("RNC atualizada com sucesso!");
      }
    } catch (error) {
      console.error('Error saving RNC:', error);
      if (mounted.current) {
        toast.error("Erro ao salvar RNC");
      }
    } finally {
      if (mounted.current) {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await rncService.delete(id);
      navigate('/quality/home', { replace: true });
    } catch (error) {
      console.error('Error deleting RNC:', error);
      toast.error("Erro ao excluir RNC");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSave)} className="container mx-auto p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <BackButton to="/quality/home" />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">RNC #{rnc.rnc_number}</h1>
          <StatusBadge status={rnc.status} />
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button 
              type="button"
              variant="ghost" 
              onClick={handlePrint} 
              className="flex-1 sm:flex-none items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            {!isEditing ? (
              <>
                <Button
                  type="button"
                  variant="default"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-none items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex-1 sm:flex-none items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              </>
            ) : (
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 sm:flex-none items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
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
                <TabsList className="w-full flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent border-b rounded-none p-0 h-auto bg-muted">
                  <div className="flex min-w-full sm:min-w-0 sm:w-full">
                    <TabsTrigger
                      value="basic"
                      className="flex-1 min-w-[120px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
                    >
                      Inf. Básicas
                    </TabsTrigger>
                    <TabsTrigger
                      value="additional"
                      className="flex-1 min-w-[120px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
                    >
                      Inf. Adicionais
                    </TabsTrigger>
                    <TabsTrigger
                      value="relational"
                      className="flex-1 min-w-[120px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
                    >
                      Inf. Relacionais
                    </TabsTrigger>
                    <TabsTrigger
                      value="workflow"
                      className="flex-1 min-w-[120px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
                    >
                      Workflow
                    </TabsTrigger>
                  </div>
                </TabsList>

                <div className="bg-background p-4 rounded-b-lg">
                  <TabsContent value="basic">
                    {mounted.current && <BasicInfoTab isEditing={isEditing} />}
                  </TabsContent>

                  <TabsContent value="additional">
                    {mounted.current && <AdditionalInfoTab isEditing={isEditing} />}
                  </TabsContent>

                  <TabsContent value="relational">
                    {mounted.current && (
                      <RelationalInfoTab
                        rncId={rnc.id}
                        isEditing={isEditing}
                        initialValues={{
                          contacts: rnc.contacts,
                          products: rnc.products,
                          attachments: rnc.attachments
                        }}
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="workflow">
                    {mounted.current && (
                      <WorkflowTab
                        rncId={rnc.id}
                        transitions={rnc.workflow_transitions}
                        isEditing={isEditing}
                      />
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-background border rounded-lg shadow p-4 sm:p-6">
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
      </form>
    </FormProvider>
  );
}

// Wrapper component with error boundary
export function RNCDetailsWrapper() {
  return (
    <RNCErrorBoundary>
      <RNCDetails />
    </RNCErrorBoundary>
  );
}

export { RNCDetails };
