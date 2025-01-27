import * as React from "react";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface ProductsTabProps {
  setProgress: (progress: number) => void;
}

export type ProductsTabRef = {
  validate: () => Promise<boolean>;
  setFormData: (data) => void;
};

const productsSchema = z.object({
  products: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Nome do produto é obrigatório"),
    weight: z.string().min(1, "Peso é obrigatório")
  })).min(1, "Pelo menos um produto deve ser adicionado")
});

export const ProductsTab = React.forwardRef<ProductsTabRef, ProductsTabProps>(
  ({ setProgress }, ref) => {
    const form = useForm<z.infer<typeof productsSchema>>({
      resolver: zodResolver(productsSchema),
      defaultValues: {
        products: [{ id: crypto.randomUUID(), name: "", weight: "" }]
      }
    });

    const { watch, setValue } = form;
    const products = watch("products");

    useEffect(() => {
      const currentData = localStorage.getItem('rncFormData');
      const parsedData = currentData ? JSON.parse(currentData) : {};
      localStorage.setItem('rncFormData', JSON.stringify({
        ...parsedData,
        products: products
      }));

      // Calculate progress
      const filledProducts = products.filter(
        product => product.name && product.weight
      ).length;
      const progress = products.length > 0 ? (filledProducts / products.length) * 100 : 0;
      setProgress(progress);
    }, [products, setProgress]);

    React.useImperativeHandle(ref, () => ({
      validate: async () => {
        const result = await form.trigger();
        return result;
      },
      setFormData: (data) => {
        if (data?.products) {
          setValue("products", data.products);
        }
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
      <Form {...form}>
        <form className="space-y-4 py-4">
          {products.map((product, index) => (
            <div key={product.id} className="flex gap-4 items-start">
              <FormField
                control={form.control}
                name={`products.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Nome do Produto <span className="text-blue-400">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Digite o nome do produto" />
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
                    <FormLabel>Peso (kg) <span className="text-blue-400">*</span></FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Digite o peso" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                className="mt-8"
                onClick={() => removeProduct(index)}
                disabled={products.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addProduct}>
            Adicionar Produto
          </Button>
        </form>
      </Form>
    );
  }
);

ProductsTab.displayName = "ProductsTab";