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
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ''}
                  disabled={!isEditing}
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
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ''}
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

        <FormField
          control={control}
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
                  <SelectItem value="Alexandre">Alexandre</SelectItem>
                  <SelectItem value="Arthur">Arthur</SelectItem>
                  <SelectItem value="Fabiana">Fabiana</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Giovani">Giovani</SelectItem>
                  <SelectItem value="Helcio">Helcio</SelectItem>
                  <SelectItem value="Izabelly">Izabelly</SelectItem>
                  <SelectItem value="Jordana">Jordana</SelectItem>
                  <SelectItem value="Marcos">Marcos</SelectItem>
                  <SelectItem value="Pedro">Pedro</SelectItem>
                  <SelectItem value="Tafaela">Rafaela</SelectItem>
                  <SelectItem value="Samuel">Samuel</SelectItem>
                  <SelectItem value="Vinicius">Vinicius</SelectItem>
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
