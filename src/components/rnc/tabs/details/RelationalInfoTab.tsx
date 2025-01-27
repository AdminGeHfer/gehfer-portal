import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/atoms/Button";
import { Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { handlePhoneChange } from "@/utils/masks";

interface RelationalInfoTabProps {
  isEditing: boolean;
}

export type RelationalInfoTabRef = {
  validate: () => Promise<boolean>;
};

const relationalInfoSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  phone: z.string().min(10, "Telefone inválido. Use o formato: (99) 99999-9999"),
  email: z.union([z.literal(""), z.string().email("Email inválido")]),
  products: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Nome do produto é obrigatório"),
    weight: z.string().min(1, "Peso é obrigatório")
  })).min(1, "Pelo menos um produto deve ser adicionado")
});

export const RelationalInfoTab = React.forwardRef<RelationalInfoTabRef, RelationalInfoTabProps>(
  ({ isEditing }, ref) => {
    const form = useForm<z.infer<typeof relationalInfoSchema>>({
      resolver: zodResolver(relationalInfoSchema),
      defaultValues: {
        name: "",
        phone: "",
        email: "",
        products: [{ id: crypto.randomUUID(), name: "", weight: "" }]
      }
    });

    const { watch, setValue } = form;
    const products = watch("products");

    React.useEffect(() => {
      const currentData = localStorage.getItem('rncDetailsData');
      const parsedData = currentData ? JSON.parse(currentData) : {};
      localStorage.setItem('rncDetailsData', JSON.stringify({
        ...parsedData,
        relational: form.getValues()
      }));
    }, [form.watch()]);

    React.useImperativeHandle(ref, () => ({
      validate: () => {
        return form.trigger();
      },
    }));

    const addProduct = () => {
      const currentProducts = form.getValues("products");
      setValue("products", [
        ...currentProducts,
        { id: crypto.randomUUID(), name: "", weight: "" }
      ]);
    };

    const removeProduct = (index: number) => {
      const currentProducts = form.getValues("products");
      if (currentProducts.length > 1) {
        setValue("products", currentProducts.filter((_, i) => i !== index));
      }
    };

    return (
      <div className="space-y-8 p-4">
        {/* Products Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Produtos</h3>
          <Form {...form}>
            <form className="space-y-4">
              {products.map((product, index) => (
                <div key={product.id} className="flex gap-4 items-start">
                  <FormField
                    control={form.control}
                    name={`products.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Produto</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} placeholder="Digite o nome do produto" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`products.${index}.weight`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" disabled={!isEditing} placeholder="Digite o peso" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-8"
                      onClick={() => removeProduct(index)}
                      disabled={products.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {isEditing && (
                <Button type="button" variant="outline" onClick={addProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              )}
            </form>
          </Form>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contato</h3>
          <Form {...form}>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Nome
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Telefone
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className="border-blue-200 focus:border-blue-400"
                        onChange={(e) => handlePhoneChange(e, field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={!isEditing}
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    );
  }
);

RelationalInfoTab.displayName = "RelationalInfoTab";