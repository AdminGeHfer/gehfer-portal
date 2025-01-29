import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { basicInfoSchema } from "@/utils/validations";
import { handleDocumentChange } from "@/utils/masks";
import type { z } from "zod";

interface BasicInfoTabProps {
  isEditing: boolean;
  initialValues?: z.infer<typeof basicInfoSchema>;
}

export type BasicInfoTabRef = {
  validate: () => Promise<boolean>;
};

export const BasicInfoTab = React.forwardRef<BasicInfoTabRef, BasicInfoTabProps>(
  ({ isEditing, initialValues }, ref) => {
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

    React.useEffect(() => {
      if (initialValues) {
        form.reset(initialValues);
      }
    }, [initialValues, form]);

    React.useImperativeHandle(ref, () => ({
      validate: () => {
        return form.trigger();
      },
    }));

    // Save form data to localStorage whenever it changes
    React.useEffect(() => {
      const subscription = form.watch((data) => {
        const currentData = localStorage.getItem('rncDetailsData');
        const parsedData = currentData ? JSON.parse(currentData) : {};
        localStorage.setItem('rncDetailsData', JSON.stringify({
          ...parsedData,
          basic: data
        }));
      });
      return () => subscription.unsubscribe();
    }, [form.watch]);

    return (
      <Form {...form}>
        <form className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Código da empresa
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      className="border-blue-200 focus:border-blue-400"
                    />
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
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      className="border-blue-200 focus:border-blue-400"
                    />
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
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
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
                  <span className="text-red-500">*</span>
                </FormLabel>
                <Select disabled={!isEditing} onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Selecione o tipo" />
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
                  <span className="text-red-500">*</span>
                </FormLabel>
                <Select disabled={!isEditing} onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Selecione o departamento" />
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
                  <span className="text-red-500">*</span>
                </FormLabel>
                <Select disabled={!isEditing} onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Selecione o responsável" />
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
          </div>
        </form>
      </Form>
    );
  }
);

BasicInfoTab.displayName = "BasicInfoTab";
