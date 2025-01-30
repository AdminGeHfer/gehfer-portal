import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleDocumentChange } from "@/utils/masks";
import { basicInfoSchema } from "@/utils/validations";
import type { z } from "zod";
import { RncDepartmentEnum, RncTypeEnum } from "@/types/rnc";

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
    console.log('BasicInfoTab mounted');
    
    const form = useForm<BasicInfoFormData>({
      resolver: zodResolver(basicInfoSchema),
      defaultValues: {
        company_code: "",
        company: "",
        document: "",
        type: RncTypeEnum.company_complaint,
        department: RncDepartmentEnum.logistics,
        responsible: "",
      },
    });

    const { watch } = form;

    const formMethods = React.useMemo(
      () => ({
        validate: async () => {
          try {
            console.log('Validating BasicInfoTab...');
            const result = await form.trigger();
            console.log('BasicInfoTab validation result:', result);
            console.log('Current form values:', form.getValues());
            return result;
          } catch (error) {
            console.error('BasicInfoTab validation error:', error);
            return false;
          }
        },
        getFormData: () => {
          try {
            const values = form.getValues();
            console.log('Getting BasicInfoTab form data:', values);
            return values;
          } catch (error) {
            console.error('Error getting BasicInfoTab form data:', error);
            throw error;
          }
        },
        setFormData: (data: Partial<BasicInfoFormData>) => {
          try {
            console.log('Setting BasicInfoTab form data:', data);
            form.reset(data);
          } catch (error) {
            console.error('Error setting BasicInfoTab form data:', error);
          }
        }
      }),
      [form]
    );

    React.useEffect(() => {
      console.log('BasicInfoTab ref methods exposed');
    }, []);

    React.useImperativeHandle(ref, () => formMethods, [formMethods]);

    const saveFormData = React.useCallback((data: BasicInfoFormData) => {
      try {
        const currentData = localStorage.getItem('rncFormData');
        const parsedData = currentData ? JSON.parse(currentData) : {};
        localStorage.setItem('rncFormData', JSON.stringify({
          ...parsedData,
          basic: data
        }));
        console.log('Saved basic data:', data);
      } catch (error) {
        console.error('Error saving basic data:', error);
      }
    }, []);

    React.useEffect(() => {
      const subscription = watch((data) => {
        saveFormData(data as BasicInfoFormData);
        const requiredFields = ["company_code", "company", "document", "type", "department", "responsible"];
        const filledRequired = requiredFields.filter(field => data[field as keyof typeof data]).length;
        setProgress((filledRequired / requiredFields.length) * 100);
      });
      return () => subscription.unsubscribe();
    }, [watch, saveFormData, setProgress]);

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
                    <SelectItem value="tax">Fiscal</SelectItem>
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
                    <SelectItem value="alexandre">Alexandre</SelectItem>
                    <SelectItem value="arthur">Arthur</SelectItem>
                    <SelectItem value="fabiana">Fabiana</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="giovani">Giovani</SelectItem>
                    <SelectItem value="helcio">Helcio</SelectItem>
                    <SelectItem value="izabelly">Izabelly</SelectItem>
                    <SelectItem value="jordana">Jordana</SelectItem>
                    <SelectItem value="marcos">Marcos</SelectItem>
                    <SelectItem value="pedro">Pedro</SelectItem>
                    <SelectItem value="rafaela">Rafaela</SelectItem>
                    <SelectItem value="samuel">Samuel</SelectItem>
                    <SelectItem value="vinicius">Vinicius</SelectItem>
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