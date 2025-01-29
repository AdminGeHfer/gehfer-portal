import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleDocumentChange } from "@/utils/masks";
import { Form } from "@/components/ui/form";
import { basicInfoSchema } from "@/utils/validations";
import type { z } from "zod";

interface BasicInfoTabProps {
  setProgress: (progress: number) => void;
}

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

export type BasicInfoTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => BasicInfoFormData;
  setFormData: (data: Partial<BasicInfoFormData>) => void;
};

export const BasicInfoTab = React.forwardRef<BasicInfoTabRef, BasicInfoTabProps>(
  ({ setProgress }, ref) => {
    const form = useForm<z.infer<typeof basicInfoSchema>>({
      resolver: zodResolver(basicInfoSchema),
      defaultValues: {
        company_code: "",
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

    // Save form data to localStorage whenever it changes
    React.useEffect(() => {
      const subscription = form.watch((data) => {
        const currentData = localStorage.getItem('rncFormData');
        const parsedData = currentData ? JSON.parse(currentData) : {};
        localStorage.setItem('rncFormData', JSON.stringify({
          ...parsedData,
          basic: data
        }));
      });
      return () => subscription.unsubscribe();
    }, [form.watch]);

    React.useEffect(() => {
      const values = form.watch();
      const filledFields = Object.values(values).filter(Boolean).length;
      const totalFields = Object.keys(values).length;
      setProgress((filledFields / totalFields) * 100);
    }, [form.watch(), setProgress]);

    React.useImperativeHandle(ref, () => ({
      validate: () => form.trigger(),
      getFormData: () => form.getValues() as BasicInfoFormData,
      setFormData: (data) => {
        if (data) {
          Object.keys(data).forEach((key) => {
            form.setValue(key as keyof z.infer<typeof basicInfoSchema>, data[key]);
          });
        }
      }
    }));

  return (
    <Form {...form}>
      <form className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="company_code"
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
);

BasicInfoTab.displayName = "BasicInfoTab";
