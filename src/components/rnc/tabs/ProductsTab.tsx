import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { productSchema } from "@/utils/validations";

interface ProductsTabProps {
  setProgress: (progress: number) => void;
}

export type ProductFormData = {
  products: z.infer<typeof productSchema>[];
};

export type ProductsTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => ProductFormData['products'];
  setFormData: (data: Partial<ProductFormData>) => void;
};

export const ProductsTab = React.forwardRef<ProductsTabRef, ProductsTabProps>(
  ({ setProgress }, ref) => {
    // Create form with useForm hook directly
    const form = useForm<ProductFormData>({
      resolver: zodResolver(z.object({
        products: z.array(productSchema).min(1)
      })),
      defaultValues: {
        products: [{ name: "", weight: 0 }]
      }
    });

    const { watch, setValue, getValues } = form;
    const products = watch("products");

    const saveFormData = React.useCallback((data: ProductFormData['products']) => {
      try {
        const currentData = localStorage.getItem('rncFormData');
        const parsedData = currentData ? JSON.parse(currentData) : {};
        localStorage.setItem('rncFormData', JSON.stringify({
          ...parsedData,
          products: data
        }));
        console.log('Saved products data:', data);
      } catch (error) {
        console.error('Error saving products data:', error);
      }
    }, []);

    React.useEffect(() => {
      const subscription = watch((data) => {
        if (data.products) {
          saveFormData(data.products);
          const filledProducts = data.products.filter(
            product => product.name && product.weight
          ).length;
          const progress = data.products.length > 0 ? 
            (filledProducts / data.products.length) * 100 : 0;
          setProgress(progress);
        }
      });
      return () => subscription.unsubscribe();
    }, [watch, saveFormData, setProgress]);

    React.useImperativeHandle(
      ref,
      () => ({
        validate: async () => {
          try {
            const result = await form.trigger();
            console.log('Products validation result:', result);
            return result;
          } catch (error) {
            console.error('Products validation error:', error);
            return false;
          }
        },
        getFormData: () => {
          try {
            const values = getValues();
            console.log('Getting products form data:', values.products);
            return values.products.map(product => ({
              name: product.name,
              weight: Number(product.weight)
            }));
          } catch (error) {
            console.error('Error getting products form data:', error);
            throw new Error('Failed to get products form data');
          }
        },
        setFormData: (data: Partial<ProductFormData>) => {
          try {
            if (data?.products) {
              console.log('Setting products form data:', data.products);
              form.reset({ products: data.products });
            }
          } catch (error) {
            console.error('Error setting products form data:', error);
          }
        }
      }),
      [form, getValues]
    );

    const addProduct = () => {
      try {
        const currentProducts = getValues("products");
        console.log('Adding new product to:', currentProducts);
        setValue("products", [
          ...currentProducts,
          { name: "", weight: 0.1 }
        ]);
      } catch (error) {
        console.error('Error adding product:', error);
      }
    };

    const removeProduct = (index: number) => {
      try {
        const currentProducts = getValues("products");
        if (currentProducts.length > 1) {
          console.log('Removing product at index:', index);
          setValue("products", currentProducts.filter((_, i) => i !== index));
        }
      } catch (error) {
        console.error('Error removing product:', error);
      }
    };

    return (
      <Form {...form}>
        <form className="space-y-4 py-4">
          {products.map((product, index) => (
            <div key={index} className="flex gap-4 items-start">
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