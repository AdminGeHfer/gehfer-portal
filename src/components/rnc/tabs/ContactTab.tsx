// In ContactTab.tsx
import * as React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handlePhoneChange } from "@/utils/masks";
import { type CreateRNCFormData } from "@/schemas/rncValidation";
import { Plus, Trash2 } from "lucide-react";

export const ContactTab = () => {
  const { control } = useFormContext<CreateRNCFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts"
  });

  React.useEffect(() => {
    // If no contacts exist, add an empty one
    if (fields.length === 0) {
      append({ name: "", phone: "", email: "" });
    }
  }, [append, fields.length]);

  return (
    <div className="space-y-4 py-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4 items-start">
          <FormField
            control={control}
            name={`contacts.${index}.name`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="flex items-center gap-1">
                  Nome
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite o nome do contato" 
                    className="border-blue-200 focus:border-blue-400" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`contacts.${index}.phone`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="flex items-center gap-1">
                  Telefone
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Digite o telefone"
                    className="border-blue-200 focus:border-blue-400"
                    onChange={(e) => handlePhoneChange(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`contacts.${index}.email`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    type="email" 
                    placeholder="Digite o email"
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
        onClick={() => append({ name: "", phone: "", email: "" })}
        className="border-blue-200 hover:border-blue-400"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Contato
      </Button>
    </div>
  );
};

ContactTab.displayName = "ContactTab";
