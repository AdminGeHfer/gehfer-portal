import { Button } from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { RNCFormData } from "@/types/rnc";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RNCBasicInfo } from "./form/RNCBasicInfo";
import { RNCCompanyInfo } from "./form/RNCCompanyInfo";
import { RNCContactInfo } from "./form/RNCContactInfo";
import { RNCFileUpload } from "./form/RNCFileUpload";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  priority: z.enum(["low", "medium", "high"]),
  type: z.enum(["client", "supplier"]),
  department: z.string().min(1, "O departamento é obrigatório"),
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
});

interface RNCFormProps {
  initialData?: Partial<RNCFormData>;
  onSubmit: (data: RNCFormData) => void;
  mode?: "create" | "edit";
}

export function RNCForm({ initialData, onSubmit, mode = "create" }: RNCFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const form = useForm<RNCFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: "medium",
      status: "open",
      type: "client",
      contact: {
        name: "",
        phone: "",
        email: "",
      },
      ...initialData,
    },
  });

  const handleSubmit = async (data: RNCFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: mode === "create" ? "RNC registrada com sucesso" : "RNC atualizada com sucesso",
        description: mode === "create" 
          ? "A RNC foi criada e será analisada em breve."
          : "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao processar RNC",
        description: "Ocorreu um erro ao tentar processar a RNC.",
        variant: "destructive",
      });
    }
  };

  const nextStep = () => {
    const fields = step === 1 
      ? ["company", "cnpj", "department"] 
      : ["contact.name", "contact.email", "description"];
    
    const isValid = fields.every(field => {
      const value = form.getValues(field);
      return value && value.length > 0;
    });

    if (isValid) {
      setStep(2);
    } else {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-[#1a1f2c] text-white">
      <CardHeader className="relative border-b border-gray-700">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 hover:bg-gray-700"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="ml-12">
          <CardTitle className="text-2xl font-bold">Nova RNC</CardTitle>
          <p className="text-gray-400 text-sm mt-1">Registre uma nova não conformidade</p>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {step === 1 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <RNCCompanyInfo form={form} />
                  <RNCBasicInfo form={form} />
                </div>
                <div className="space-y-6">
                  <RNCFileUpload form={form} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <RNCContactInfo form={form} />
                </div>
                <div className="space-y-6">
                  <RNCFileUpload form={form} />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
              {step === 2 ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-32"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    className="w-32 bg-blue-600 hover:bg-blue-700"
                  >
                    Finalizar
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-32 bg-blue-600 hover:bg-blue-700"
                >
                  Avançar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}