import * as React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RNCBasicInfoProps {
  form: UseFormReturn<RNCFormData>;
  isEditing?: boolean;
}

export const RNCBasicInfo = ({ form, isEditing = false }: RNCBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="required-field">Tipo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
              <FormControl>
                <SelectTrigger>
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
            <FormLabel className="required-field">Departamento</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento" />
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="required-field">Descrição</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva detalhadamente a não conformidade"
                className="min-h-[100px]"
                {...field}
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};