import * as React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";
import { ProductsTable } from "./ProductsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import Subtitle from "@/components/quality/form/Subtitle";

interface OrderFieldsProps {
  form: UseFormReturn<RNCFormData>;
  canEdit: boolean;
}

export function OrderFields({ form, canEdit }: OrderFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products"
  });

  return (
    <>
      <FormField
        control={form.control}
        name="products"
        render={() => (
          <FormItem className="space-y-2">
            <FormLabel className="required-field">Produtos e Pesos</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <ProductsTable
                  form={form}
                  fields={fields}
                  canEdit={canEdit}
                  onRemove={remove}
                />
                {canEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ product: "", weight: 0 })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Produto
                  </Button>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
                value={field.value || ''} 
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
                value={field.value || ''} 
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
                value={field.value || ''} 
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