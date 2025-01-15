import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";
import { handleCNPJChange, formatCNPJ } from "@/utils/masks";

interface RNCCompanyInfoProps {
  form: UseFormReturn<RNCFormData>;
  showErrors?: boolean;
}

export const RNCCompanyInfo = ({ form, showErrors = false }: RNCCompanyInfoProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="company"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="required-field">Razão Social</FormLabel>
            <FormControl>
              <Input 
                placeholder="Nome da empresa" 
                {...field} 
              />
            </FormControl>
            {(showErrors || fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="cnpj"
        render={({ field: { onChange, value, ...field }, fieldState }) => (
          <FormItem>
            <FormLabel>CNPJ</FormLabel>
            <FormControl>
              <Input 
                placeholder="00.000.000/0000-00"
                value={value ? formatCNPJ(value) : ''}
                onChange={(e) => handleCNPJChange(e, onChange)}
                maxLength={18}
                {...field}
              />
            </FormControl>
            {(showErrors || fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="order_number"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Nº do Pedido</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite o número do pedido" 
                {...field} 
              />
            </FormControl>
            {(showErrors || fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="return_number"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Nº da Devolução</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite o número da devolução" 
                {...field} 
              />
            </FormControl>
            {(showErrors || fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />
    </div>
  );
};