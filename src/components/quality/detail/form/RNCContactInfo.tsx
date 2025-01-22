import * as React from "react";
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
import Subtitle from "@/components/quality/form/Subtitle";

interface RNCContactInfoProps {
  form: UseFormReturn<RNCFormData>;
  isEditing?: boolean;
}

export const RNCContactInfo = ({ form, isEditing = false }: RNCContactInfoProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="contact.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="required-field">Nome do Contato</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite o nome do contato" 
                {...field} 
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage className="form-message" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="required-field">Telefone</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite o telefone" 
                {...field} 
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage className="form-message" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="required-field">Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="Digite o email" 
                {...field} 
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage className="form-message" />
          </FormItem>
        )}
      />
    <Subtitle text="* Campos obrigatórios" color="skyblue" />
    </div>
  );
};