import * as React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RNCFormData } from "@/types/rnc";
import { UseFormReturn } from "react-hook-form";

interface RNCBasicInfoProps {
  form: UseFormReturn<RNCFormData>;
  isEditing: boolean;
}

const RESPONSIBLE_OPTIONS = [
  "Alexandre",
  "Arthur",
  "Marcos",
  "Financeiro",
  "Giovani",
  "Helcio",
  "Izabelly",
  "Jordana",
  "Pedro",
  "Samuel"
];

export function RNCBasicInfo({ form, isEditing }: RNCBasicInfoProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="required-field">Descrição</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva a não conformidade"
                className="min-h-[100px]"
                disabled={!isEditing}
                {...field}
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
        name="responsible"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="required-field">Responsável</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value} 
              disabled={!isEditing}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {RESPONSIBLE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}