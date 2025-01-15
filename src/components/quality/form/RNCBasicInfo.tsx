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
import Subtitle from "@/components/quality/form/Subtitle";

interface RNCBasicInfoProps {
  form: UseFormReturn<RNCFormData>;
  showErrors?: boolean;
}

export const RNCBasicInfo = ({ form, showErrors = false }: RNCBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="required-field">Descrição</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva detalhadamente a não conformidade"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            {(showErrors || fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="department"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="required-field">Departamento</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Expedição">Expedição</SelectItem>
                <SelectItem value="Logistica">Logística</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
                <SelectItem value="Qualidade">Qualidade</SelectItem>
              </SelectContent>
            </Select>
            {(showErrors || fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="required-field">Tipo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="client">Cliente</SelectItem>
                <SelectItem value="supplier">Fornecedor</SelectItem>
              </SelectContent>
            </Select>
            {(showErrors || fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="priority"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="required-field">Prioridade</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
            {(showErrors || fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />
    <Subtitle text="* Campos obrigatórios" color="skyblue" />
    </div>
  );
};