import { Button } from "@/components/atoms/Button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { RNC, RNCFormData } from "@/types/rnc";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RNCBasicInfo } from "./form/RNCBasicInfo";
import { RNCCompanyInfo } from "./form/RNCCompanyInfo";
import { RNCContactInfo } from "./form/RNCContactInfo";
import { RNCOrderInfo } from "./form/RNCOrderInfo";
import { RNCFileUpload } from "./form/RNCFileUpload";
import { RNCAttachments } from "./RNCAttachments";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  company_code: z.string().min(1, "O código da empresa é obrigatório"),
  company: z.string().min(1, "O nome da empresa é obrigatória"),
  cnpj: z.union([z.string().nullable(), z.string().regex(/^[0,9]{2}\.[0,9]{3}\.[0,9]{3}\/[0,9]{4}-[0,9]{2}$/, "CNPJ inválido")]).optional().transform(e => e === "" ? undefined : e),
  type: z.enum(["company_complaint", "supplier", "dispatch", "logistics", "deputy", "driver", "financial", "commercial", "financial_agreement"]).default("company_complaint"),
  products: z.array(z.object({
    product: z.string().min(1, "O produto é obrigatório"),
    weight: z.number().min(0, "O peso deve ser maior que 0"),
  })).optional(),
  description: z.string().min(1, "A descrição é obrigatória"),
  weight: z.number().min(0, "O peso deve ser maior que 0"),
  korp: z.string().min(1, "O número do pedido é obrigatório"),
  nfd: z.string().optional(),
  nfv: z.string().optional(),
  department: z.enum(["logistics", "quality", "financial"]).default("logistics"),
  contact: z.object({
    name: z.string().min(1, "O nome do contato é obrigatório"),
    phone: z.string().regex(/^[(]{0,1}[0-9]{1,2}[)]{0,1}\s[0-9]{4,5}-[0-9]{4}$/, "Telefone inválido"),
    email: z.union([z.string().nullable(), z.string().email("Email inválido")]).optional().transform(e => e === "" ? undefined : e),
  }),
  attachments: z.array(z.instanceof(File)).optional(),
  conclusion: z.string().optional(),
  workflow_status: z.enum(["open", "analysis", "resolution", "solved", "closing", "closed"]).default("open"),
  assigned_to: z.string().optional(),
  responsible: z.string().optional(),
});

interface RNCDetailFormProps {
  rnc: RNC;
  isEditing: boolean;
  onFieldChange: (field: keyof RNC, value: any) => void;
  onSave?: () => Promise<void>;
}

export function RNCDetailForm({ rnc, isEditing, onFieldChange, onSave }: RNCDetailFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("company");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RNCFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_code: rnc.company_code,
      company: rnc.company,
      cnpj: rnc.cnpj,
      type: rnc.type,
      products: rnc.products,
      description: rnc.description,
      korp: rnc.korp,
      nfd: rnc.nfd,
      nfv: rnc.nfv,
      department: rnc.department,
      contact: rnc.contact,
      attachments: rnc.attachments,
      conclusion: rnc.conclusion,
      workflow_status: rnc.workflow_status,
      assigned_to: rnc.assigned_to,
      responsible: rnc.responsible,
    },
  });

  const handleSubmit = async (data: RNCFormData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Update all form fields
      Object.keys(data).forEach((key) => {
        onFieldChange(key as keyof RNC, data[key as keyof RNCFormData]);
      });

      // Call parent save handler if provided
      if (onSave) {
        await onSave();
      }

      toast({
        title: "RNC atualizada com sucesso",
        description: "As alterações foram salvas.",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Erro ao atualizar RNC",
        description: "Ocorreu um erro ao tentar atualizar a RNC.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="order">Pedido</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <TabsContent value="company" className="space-y-6">
              <div className="grid gap-6">
                <RNCCompanyInfo form={form} isEditing={isEditing} />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-6">
                <RNCBasicInfo form={form} isEditing={isEditing} />
                {isEditing && <RNCFileUpload form={form} />}
                <RNCAttachments rncId={rnc.id} canEdit={isEditing} />
              </div>
            </TabsContent>

            <TabsContent value="order" className="space-y-6">
              <div className="grid gap-6">
                <RNCOrderInfo form={form} isEditing={isEditing} />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid gap-6">
                <RNCContactInfo form={form} isEditing={isEditing} />
              </div>
            </TabsContent>

            {isEditing && (
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (activeTab === "details") setActiveTab("company");
                    if (activeTab === "order") setActiveTab("details");
                    if (activeTab === "contact") setActiveTab("order");
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
                      if (activeTab === "details") setActiveTab("order");
                      if (activeTab === "order") setActiveTab("contact");
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
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                )}
              </div>
            )}
          </form>
        </Form>
      </Tabs>
    </div>
  );
}