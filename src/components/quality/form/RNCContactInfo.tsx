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

interface RNCContactInfoProps {
  form: UseFormReturn<RNCFormData>;
  showErrors?: boolean;
}

export const RNCContactInfo = ({ form, showErrors = false }: RNCContactInfoProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="contact.name"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="required-field">Nome do Contato</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite o nome do contato" 
                {...field} 
              />
            </FormControl>
            {(showErrors || fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact.phone"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="required-field">Telefone</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite o telefone" 
                {...field} 
              />
            </FormControl>
            {(showErrors || fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact.email"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="Digite o email" 
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