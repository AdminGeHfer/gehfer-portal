import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "@/components/rnc/tabs/details/BasicInfoTab";
import { AdditionalInfoTab } from "@/components/rnc/tabs/details/AdditionalInfoTab";
import { RelationalInfoTab } from "@/components/rnc/tabs/details/RelationalInfoTab";
import { WorkflowTab } from "@/components/rnc/tabs/details/WorkflowTab";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { useRNCDetails } from "@/hooks/useRNCDetails";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateRNCFormData, updateRNCSchema } from "@/schemas/rncValidation";

interface RNCDetailsProps {
  id?: string;
  onClose?: () => void;
}

export function RNCDetails({ id: propId, onClose }: RNCDetailsProps) {
  const { id: routeId } = useParams();
  const id = propId || routeId;
  const { rnc, loading } = useRNCDetails(id!);
  const [activeTab, setActiveTab] = React.useState("basic");

  const methods = useForm<UpdateRNCFormData>({
    resolver: zodResolver(updateRNCSchema),
    defaultValues: {
      company_code: rnc?.company_code || '',
      company: rnc?.company || '',
      document: rnc?.document || '',
      type: rnc?.type,
      department: rnc?.department,
      responsible: rnc?.responsible || '',
      description: rnc?.description || '',
      korp: rnc?.korp || '',
      nfv: rnc?.nfv || '',
      nfd: rnc?.nfd || '',
      city: rnc?.city || '',
      collected_at: rnc?.collected_at || null,
      closed_at: rnc?.closed_at || null,
      conclusion: rnc?.conclusion || '',
      contacts: rnc?.contacts || [],
      products: rnc?.products || [],
      attachments: rnc?.attachments || []
    }
  });

  if (loading) return <div>Carregando...</div>;
  if (!rnc) return <div>RNC não encontrada</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">RNC #{rnc.rnc_number}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <FormProvider {...methods}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="basic">Inf. Básicas</TabsTrigger>
              <TabsTrigger value="additional">Inf. Adicionais</TabsTrigger>
              <TabsTrigger value="relational">Inf. Relacionais</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <BasicInfoTab 
                isEditing={false} 
                initialValues={{
                  company_code: rnc.company_code,
                  company: rnc.company,
                  document: rnc.document,
                  type: rnc.type,
                  department: rnc.department,
                  responsible: rnc.responsible || ''
                }}
              />
            </TabsContent>

            <TabsContent value="additional">
              <AdditionalInfoTab 
                isEditing={false}
                initialValues={{
                  description: rnc.description,
                  korp: rnc.korp || '',
                  nfv: rnc.nfv || '',
                  nfd: rnc.nfd,
                  city: rnc.city,
                  collected_at: rnc.collected_at,
                  closed_at: rnc.closed_at,
                  conclusion: rnc.conclusion
                }}
              />
            </TabsContent>

            <TabsContent value="relational">
              <RelationalInfoTab 
                rncId={rnc.id} 
                isEditing={false}
                initialValues={{
                  contacts: rnc.contacts,
                  products: rnc.products,
                  attachments: rnc.attachments
                }}
              />
            </TabsContent>

            <TabsContent value="workflow">
              <WorkflowTab 
                rncId={rnc.id} 
                isEditing={false}
                transitions={rnc.workflow_transitions || []}
              />
            </TabsContent>
          </Tabs>
        </FormProvider>
      </div>
    </div>
  );
}
