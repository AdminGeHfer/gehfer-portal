import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleDocumentChange } from "@/utils/masks";
import { RncDepartmentEnum, RncTypeEnum } from "@/types/rnc";
import { BasicInfoFormData, basicInfoSchema } from "@/schemas/rncValidation";

interface BasicInfoTabProps {
  isEditing: boolean;
  initialValues?: {
    company_code: string;
    company: string;
    document: string;
    type: RncTypeEnum;
    department: RncDepartmentEnum;
    responsible: string;
  };
}

export type BasicInfoTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => BasicInfoFormData;
};

export const BasicInfoTab = React.forwardRef<BasicInfoTabRef, BasicInfoTabProps>(
  ({ isEditing, initialValues }, ref) => {
    const form = useForm<BasicInfoFormData>({
      resolver: zodResolver(basicInfoSchema),
      defaultValues: initialValues
    });

    React.useImperativeHandle(ref, () => ({
      validate: () => form.trigger(),
      getFormData: () => form.getValues()
    }));

  return (
    <div className="space-y-4 py-4">
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
                  <SelectItem value={RncTypeEnum.company_complaint}>Reclamação do Cliente</SelectItem>
                  <SelectItem value={RncTypeEnum.supplier}>Fornecedor</SelectItem>
                  <SelectItem value={RncTypeEnum.dispatch}>Expedição</SelectItem>
                  <SelectItem value={RncTypeEnum.logistics}>Logística</SelectItem>
                  <SelectItem value={RncTypeEnum.deputy}>Representante</SelectItem>
                  <SelectItem value={RncTypeEnum.driver}>Motorista</SelectItem>
                  <SelectItem value={RncTypeEnum.financial}>Financeiro</SelectItem>
                  <SelectItem value={RncTypeEnum.commercial}>Comercial</SelectItem>
                  <SelectItem value={RncTypeEnum.financial_agreement}>Acordo Financeiro</SelectItem>
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
                  <SelectItem value={RncDepartmentEnum.logistics}>Logística</SelectItem>
                  <SelectItem value={RncDepartmentEnum.quality}>Qualidade</SelectItem>
                  <SelectItem value={RncDepartmentEnum.financial}>Financeiro</SelectItem>
                  <SelectItem value={RncDepartmentEnum.tax}>Fiscal</SelectItem>
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
    </div>
  );
},
);

BasicInfoTab.displayName = "BasicInfoTab";
