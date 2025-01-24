import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleDocumentChange } from "@/utils/masks";

const formSchema = z.object({
  companyCode: z.string().min(3, "Código da empresa deve ter no mínimo 3 caracteres"),
  company: z.string().min(3, "Empresa deve ter no mínimo 3 caracteres"),
  document: z.string().regex(
    /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/,
    "Documento inválido. Use um CPF ou CNPJ válido"
  ),
  type: z.string().min(1, "Tipo é obrigatório"),
  department: z.string().min(1, "Departamento é obrigatório"),
  responsible: z.string().min(1, "Responsável é obrigatório"),
});

interface BasicInfoTabProps {
  setProgress: (progress: number) => void;
}

export function BasicInfoTab({ setProgress }: BasicInfoTabProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyCode: "",
      company: "",
      document: "",
      type: "",
      department: "",
      responsible: "",
    },
  });

  const responsibleOptions = [
    "Alexandre",
    "Arthur",
    "Financeiro",
    "Giovani",
    "Helcio",
    "Izabelly",
    "Jordana",
    "Marcos",
    "Pedro",
    "Samuel",
  ];

  React.useEffect(() => {
    const values = form.watch();
    const filledFields = Object.values(values).filter(Boolean).length;
    const totalFields = Object.keys(values).length;
    setProgress((filledFields / totalFields) * 100);
  }, [form.watch(), setProgress]);

  return (
    <Form {...form}>
      <form className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="companyCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Código da empresa
                <span className="text-blue-400">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o código da empresa" className="border-blue-200 focus:border-blue-400" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Empresa
                <span className="text-blue-400">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o nome da empresa" className="border-blue-200 focus:border-blue-400" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Documento
                <span className="text-blue-400">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Digite o documento (CNPJ/CPF)" 
                  className="border-blue-200 focus:border-blue-400"
                  onChange={(e) => handleDocumentChange(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Tipo
                <span className="text-blue-400">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="company_complaint">Reclamação do Cliente</SelectItem>
                  <SelectItem value="supplier">Fornecedor</SelectItem>
                  <SelectItem value="dispatch">Expedição</SelectItem>
                  <SelectItem value="logistics">Logística</SelectItem>
                  <SelectItem value="deputy">Representante</SelectItem>
                  <SelectItem value="driver">Motorista</SelectItem>
                  <SelectItem value="financial">Financeiro</SelectItem>
                  <SelectItem value="commercial">Comercial</SelectItem>
                  <SelectItem value="financial_agreement">Acordo Financeiro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Departamento
                <span className="text-blue-400">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Selecione um departamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="logistics">Logística</SelectItem>
                  <SelectItem value="quality">Qualidade</SelectItem>
                  <SelectItem value="financial">Financeiro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Responsável
                <span className="text-blue-400">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Responsável" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {responsibleOptions.map((option) => (
                    <SelectItem key={option} value={option.toLowerCase()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}