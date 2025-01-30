import * as React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

export const ProductsTab = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products"
  });

  React.useEffect(() => {
    // If no products exist, add an empty one
    if (fields.length === 0) {
      append({ name: "", weight: 0.1 });
    }
  }, [append, fields.length]);

  return (
    <div className="space-y-4 py-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4 items-start">
          <FormField
            control={control}
            name={`products.${index}.name`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="flex items-center gap-1">
                  Nome do Produto
                  <span className="text-blue-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite o nome do produto" 
                    className="border-blue-200 focus:border-blue-400" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`products.${index}.weight`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="flex items-center gap-1">
                  Peso (kg)
                  <span className="text-blue-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    type="number"
                    step="0.01"
                    min="0.01"
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseFloat(value) : '');
                    }}
                    placeholder="Digite o peso"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="ghost"
            className="mt-8"
            onClick={() => remove(index)}
            disabled={fields.length === 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button 
        type="button" 
        variant="outline" 
        onClick={() => append({ name: "", weight: 0.1 })}
        className="border-blue-200 hover:border-blue-400"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Produto
      </Button>
    </div>
  );
};