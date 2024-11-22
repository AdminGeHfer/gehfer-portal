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
    <Card className="dark:bg-gray-800/95 backdrop-blur-lg animate-scale-in">
      <CardHeader>
        <CardTitle className="dark:text-white">
          {mode === "create" ? "Nova RNC" : "Editar RNC"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <RNCBasicInfo form={form} />
            <RNCCompanyInfo form={form} />
            <RNCContactInfo form={form} />
            <RNCFileUpload form={form} />
            <Button type="submit" className="w-full hover:scale-[1.02] transition-transform">
              {mode === "create" ? "Registrar RNC" : "Salvar Alterações"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}