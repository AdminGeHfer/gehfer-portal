import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleDocumentChange } from "@/utils/masks";
import { basicInfoSchema } from "@/utils/validations";
import { RncDepartmentEnum, RncTypeEnum } from "@/types/rnc";
import type { z } from "zod";

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

export type BasicInfoTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => BasicInfoFormData;
  setFormData: (data: Partial<BasicInfoFormData>) => void;
};

export const BasicInfoTab = () => {
  const { control } = useFormContext();

    return (
        <div className="space-y-4 py-4">
          <FormField
            control={control}
            name="company_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Código da empresa
                  <span className="text-blue-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} className="border-blue-200 focus:border-blue-400" placeholder="Digite o código da empresa (Korp)" />
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
                  <span className="text-blue-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} className="border-blue-200 focus:border-blue-400" placeholder="Digite o nome da empresa" />
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
                  <span className="text-blue-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    onChange={(e) => handleDocumentChange(e, field.onChange)}
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
                  <span className="text-blue-400">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Selecione um tipo" />
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
                  <span className="text-blue-400">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Selecione um departamento" />
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
                  <span className="text-blue-400">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Selecione um Responsável" />
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
                    <SelectItem value="Rafaela">Rafaela</SelectItem>
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
