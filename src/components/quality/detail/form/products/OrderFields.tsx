import * as React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";
import Subtitle from "@/components/quality/form/Subtitle";

interface OrderFieldsProps {
  form: UseFormReturn<RNCFormData>;
  canEdit: boolean;
}

export function OrderFields({ form, canEdit }: OrderFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="korp"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="required-field">Número do Pedido</FormLabel>
            <FormControl>
              <Input 
                placeholder="Número do pedido (KORP)" 
                {...field} 
                disabled={!canEdit}
              />
            </FormControl>
            {(fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nfv"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="required-field">NFV</FormLabel>
            <FormControl>
              <Input 
                placeholder="Número da Nota de Venda" 
                {...field} 
                disabled={!canEdit}
              />
            </FormControl>
            {(fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nfd"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>NFD</FormLabel>
            <FormControl>
              <Input 
                placeholder="Número da Nota de Devolução" 
                {...field} 
                disabled={!canEdit}
              />
            </FormControl>
            {(fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />
      <Subtitle text="* Campos obrigatórios" color="skyblue" />
    </>
  );
}