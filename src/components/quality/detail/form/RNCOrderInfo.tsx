import * as React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { ProductsTable } from "./products/ProductsTable";
import { OrderFields } from "./products/OrderFields";

interface RNCOrderInfoProps {
  form: UseFormReturn<RNCFormData>;
  isEditing: boolean;
  status?: string;
}

export const RNCOrderInfo = ({ form, isEditing = false, status }: RNCOrderInfoProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products"
  });

  const canEdit = isEditing && (status === "pending" || status === "collect");
  const canAddProducts = canEdit;

  console.log("Products in form:", fields);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="products"
        render={() => (
          <FormItem className="space-y-2">
            <FormLabel className="required-field">Produtos e Pesos</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <ProductsTable 
                  fields={fields}
                  canEdit={canEdit}
                  form={form}
                  onRemove={remove}
                />
                {canAddProducts && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({
                      product: "",
                      weight: 0
                    })}
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

      <OrderFields form={form} canEdit={canEdit} />
    </div>
  );
};