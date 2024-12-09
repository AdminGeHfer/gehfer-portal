import { Button } from "@/components/atoms/Button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { RNCFormData, DepartmentEnum, WorkflowStatusEnum } from "@/types/rnc";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RNCBasicInfo } from "./form/RNCBasicInfo";
import { RNCCompanyInfo } from "./form/RNCCompanyInfo";
import { RNCContactInfo } from "./form/RNCContactInfo";
import { RNCFileUpload } from "./form/RNCFileUpload";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logAuditEvent } from "@/services/auditService";

const formSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória"),
  priority: z.enum(["low", "medium", "high"]),
  type: z.enum(["client", "supplier"]),
  department: z.nativeEnum(DepartmentEnum),
  contact: z.object({
    name: z.string().min(1, "O nome do contato é obrigatório"),
    phone: z.string().min(1, "O telefone é obrigatório"),
    email: z.string().email("Email inválido"),
  }),
  company: z.string().min(1, "A empresa é obrigatória"),
  cnpj: z.string().min(14, "CNPJ inválido").max(14),
  order_number: z.string().optional(),
  return_number: z.string().optional(),
  workflow_status: z.nativeEnum(WorkflowStatusEnum).default(WorkflowStatusEnum.OPEN),
  assigned_to: z.string().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
  resolution: z.string().optional(),
});

const defaultValues: RNCFormData = {
  description: "",
  priority: "medium",
  type: "client",
  department: DepartmentEnum.EXPEDITION,
  contact: {
    name: "",
    phone: "",
    email: "",
  },
  company: "",
  cnpj: "",
  order_number: "",
  return_number: "",
  workflow_status: WorkflowStatusEnum.OPEN,
  assigned_to: "",
  attachments: [],
  resolution: "",
};

interface RNCFormProps {
  initialData?: Partial<RNCFormData>;
  onSubmit: (data: RNCFormData) => Promise<string>;
  mode?: "create" | "edit";
}

export function RNCForm({ initialData, onSubmit, mode = "create" }: RNCFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("company");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  
  const form = useForm<RNCFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      ...initialData,
    },
    mode: "onSubmit"
  });

  const handleSubmit = async (data: RNCFormData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setShowValidationErrors(true);
      
      const rncId = await onSubmit(data);
      await logAuditEvent({
        action: 'create',
        resourceType: 'rnc',
        resourceId: rncId
      });

      toast({
        title: "RNC criada com sucesso",
        description: "A RNC foi registrada no sistema.",
      });
    } catch (error) {
      console.error('Error in RNC submission:', error);
      toast({
        title: "Erro ao processar RNC",
        description: "Ocorreu um erro ao tentar processar a RNC.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <TabsContent value="company" className="space-y-6">
              <div className="grid gap-6">
                <RNCCompanyInfo form={form} showErrors={showValidationErrors} />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-6">
                <RNCBasicInfo form={form} showErrors={showValidationErrors} />
                <RNCFileUpload form={form} showErrors={showValidationErrors} />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid gap-6">
                <RNCContactInfo form={form} showErrors={showValidationErrors} />
              </div>
            </TabsContent>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (activeTab === "details") setActiveTab("company");
                  if (activeTab === "contact") setActiveTab("details");
                }}
                className="w-32"
                disabled={activeTab === "company" || isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              {activeTab !== "contact" ? (
                <Button
                  type="button"
                  onClick={() => {
                    if (activeTab === "company") setActiveTab("details");
                    if (activeTab === "details") setActiveTab("contact");
                  }}
                  className="w-32"
                  disabled={isSubmitting}
                >
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="w-32"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Finalizar"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
