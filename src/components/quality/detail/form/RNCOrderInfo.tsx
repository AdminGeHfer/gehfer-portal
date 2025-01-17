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


interface RNCOrderInfoProps {
  form: UseFormReturn<RNCFormData>;
  isEditing?: boolean;
}

export const RNCOrderInfo = ({ form, isEditing = false }: RNCOrderInfoProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="product.product"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Produto</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Produto"
                className="min-h-[100px]"
                {...field}
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="product.weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Peso</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Peso do Produto"
                className="min-h-[100px]"
                {...field}
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="korp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número do pedido</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Número do pedido (KORP)"
                className="min-h-[100px]"
                {...field}
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nfv"
        render={({ field }) => (
          <FormItem>
            <FormLabel>NFV</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Número da Nota de Venda"
                className="min-h-[100px]"
                {...field}
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nfd"
        render={({ field }) => (
          <FormItem>
            <FormLabel>NFD</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Número da Nota de Devolução"
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