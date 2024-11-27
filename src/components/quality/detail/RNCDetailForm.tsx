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
import { RNCFileUpload } from "./form/RNCFileUpload";
import { RNCAttachments } from "./RNCAttachments";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória"),
  priority: z.enum(["low", "medium", "high"]),
  type: z.enum(["client", "supplier"]),
  department: z.enum(["Expedição", "Logistica", "Comercial", "Qualidade", "Produção"]),
  contact: z.object({
    name: z.string().min(1, "O nome do contato é obrigatório"),
    phone: z.string().min(1, "O telefone é obrigatório"),
    email: z.string().email("Email inválido"),
  }),
  orderNumber: z.string().optional(),
  returnNumber: z.string().optional(),
  company: z.string().min(1, "A empresa é obrigatória"),
  cnpj: z.string().min(14, "CNPJ inválido").max(14),
  status: z.enum(["open", "in_progress", "closed"]).default("open"),
  assignedTo: z.string().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
  resolution: z.string().optional(),
});

interface RNCDetailFormProps {
  rnc: RNC;
  isEditing: boolean;
  onFieldChange: (field: keyof RNC, value: any) => void;
}

export function RNCDetailForm({ rnc, isEditing, onFieldChange }: RNCDetailFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("company");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RNCFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: rnc.description,
      priority: rnc.priority,
      type: rnc.type,
      department: rnc.department,
      contact: rnc.contact,
      company: rnc.company,
      cnpj: rnc.cnpj,
      orderNumber: rnc.orderNumber,
      returnNumber: rnc.returnNumber,
      status: rnc.status,
      assignedTo: rnc.assignedTo,
      resolution: rnc.resolution,
    },
  });

  const handleSubmit = async (data: RNCFormData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      Object.keys(data).forEach((key) => {
        onFieldChange(key as keyof RNC, data[key as keyof RNCFormData]);
      });
      toast({
        title: "RNC atualizada com sucesso",
        description: "As alterações foram salvas.",
      });
    } catch (error) {
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
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <TabsContent value="company" className="space-y-6">
              <div className="grid gap-6">
                <RNCCompanyInfo form={form} />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <div className="grid gap-6">
                <RNCBasicInfo form={form} />
                <RNCFileUpload form={form} />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid gap-6">
                <RNCContactInfo form={form} />
              </div>
            </TabsContent>

            {isEditing && (
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (activeTab === "details") setActiveTab("company");
                    if (activeTab === "contact") setActiveTab("details");
                  }}
                  className="w-32"
                  disabled={activeTab === "company"}
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
      {rnc.id && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Anexos</h3>
          <RNCAttachments rncId={rnc.id} />
        </div>
      )}
    </div>
  );
}
