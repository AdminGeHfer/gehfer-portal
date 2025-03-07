import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleDocumentChange } from "@/utils/masks";
import { RncDepartmentEnum, RncTypeEnum } from "@/types/rnc";
import { BasicInfoFormData, UpdateRNCFormData } from "@/schemas/rncValidation";

export type BasicInfoTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => BasicInfoFormData;
};

export const BasicInfoTab = ({ isEditing }: { isEditing: boolean }) => {
  const { control } = useFormContext<UpdateRNCFormData>();

  return (
      <div className="space-y-4">
        <FormField
          control={control}
          name="company_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Código da empresa
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ''}
                  disabled={!isEditing}
                  placeholder="Digite o código da empresa"
                  className="border-blue-200 focus:border-blue-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
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
                  value={field.value || ''}
                  disabled={!isEditing}
                  placeholder="Digite o nome da empresa"
                  className="border-blue-200 focus:border-blue-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Documento
              </FormLabel>
              <FormControl>
                <Input
                  {...field} 
                  onChange={(e) => {
                    if (e.target.value) {
                      handleDocumentChange(e);
                    }
                    field.onChange(e);
                  }}
                  disabled={!isEditing}
                  className="border-blue-200 focus:border-blue-400"
                  placeholder="Digite o documento da empresa"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
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
                  <SelectItem value={RncTypeEnum.company_complaint}>Cliente</SelectItem>
                  <SelectItem value={RncTypeEnum.supplier}>Fornecedor</SelectItem>
                  <SelectItem value={RncTypeEnum.dispatch}>Expedição</SelectItem>
                  <SelectItem value={RncTypeEnum.logistics}>Logística</SelectItem>
                  <SelectItem value={RncTypeEnum.commercial}>Comercial</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
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
      </div>
  );
};

BasicInfoTab.displayName = "BasicInfoTab";
