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
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  return (
    <Card className="w-full max-w-4xl mx-auto dark:bg-gray-800/95 backdrop-blur-lg animate-scale-in">
      <CardHeader className="relative border-b dark:border-gray-700">
        <CardTitle className="text-2xl font-bold dark:text-white">
          {mode === "create" ? "Nova RNC" : "Editar RNC"}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => navigate(-1)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="bg-white/5 p-6 rounded-lg border dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">Informações Básicas</h3>
                  <RNCBasicInfo form={form} />
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg border dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">Informações da Empresa</h3>
                  <RNCCompanyInfo form={form} />
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="bg-white/5 p-6 rounded-lg border dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">Informações de Contato</h3>
                  <RNCContactInfo form={form} />
                </div>
                
                <div className="bg-white/5 p-6 rounded-lg border dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">Anexos</h3>
                  <RNCFileUpload form={form} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-32 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-32 bg-primary hover:bg-primary/90"
              >
                {mode === "create" ? "Criar RNC" : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}