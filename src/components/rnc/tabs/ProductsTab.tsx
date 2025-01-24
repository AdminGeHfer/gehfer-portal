import * as React from "react";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/ui/form";
import { z } from "zod";

interface Product {
  id: string;
  name: string;
  weight: string;
  error?: {
    name?: string;
    weight?: string;
  };
}

interface ProductsTabProps {
  setProgress: (progress: number) => void;
}

export type ProductsTabRef = {
  validate: () => Promise<boolean>;
};

const productSchema = z.object({
  name: z.string().min(3, "Produto deve ter no mínimo 3 caracteres"),
  weight: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Peso deve ser um número maior que 0"),
});

export const ProductsTab = React.forwardRef<ProductsTabRef, ProductsTabProps>(
  ({ setProgress }, ref) => {
    const [products, setProducts] = useState<Product[]>([
      { id: "1", name: "", weight: "" },
    ]);

    const validateProduct = (product: Product) => {
      try {
        productSchema.parse({ name: product.name, weight: product.weight });
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          return error.errors.reduce((acc, curr) => {
            const path = curr.path[0] as string;
            return { ...acc, [path]: curr.message };
          }, {});
        }
        return {};
      }
    };

    React.useImperativeHandle(ref, () => ({
      validate: async () => {
        const updatedProducts = products.map(p => ({
          ...p,
          error: validateProduct(p)
        }));
        setProducts(updatedProducts);
        return updatedProducts.every(p => Object.keys(p.error || {}).length === 0);
      },
    }));

  const addProduct = () => {
    setProducts([
      ...products,
      { id: Math.random().toString(), name: "", weight: "" },
    ]);
  };

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const updateProduct = (id: string, field: "name" | "weight", value: string) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const updatedProduct = { ...p, [field]: value };
          const errors = validateProduct(updatedProduct);
          return { ...updatedProduct, error: errors };
        }
        return p;
      })
    );
  };

  React.useEffect(() => {
    const validProducts = products.filter(p => {
      const errors = validateProduct(p);
      return Object.keys(errors).length === 0 && p.name && p.weight;
    }).length;
    setProgress(products.length > 0 ? (validProducts / products.length) * 100 : 0);
  }, [products, setProgress]);

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-[1fr,1fr,auto] gap-4">
        <div className="font-medium text-sm text-blue-900 dark:text-blue-100">
          Produto <span className="text-blue-400">*</span>
        </div>
        <div className="font-medium text-sm text-blue-900 dark:text-blue-100">
          Peso <span className="text-blue-400">*</span>
        </div>
        <div></div>
      </div>

      {products.map((product) => (
        <div key={product.id} className="space-y-2">
          <div className="grid grid-cols-[1fr,1fr,auto] gap-4">
            <div className="space-y-1">
              <Input
                value={product.name}
                onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                placeholder="Digite o nome do produto"
                className="border-blue-200 focus:border-blue-400"
              />
              {product.error?.name && (
                <FormMessage>{product.error.name}</FormMessage>
              )}
            </div>
            <div className="space-y-1">
              <Input
                value={product.weight}
                onChange={(e) => updateProduct(product.id, "weight", e.target.value)}
                placeholder="Peso do produto (kg)"
                className="border-blue-200 focus:border-blue-400"
                type="number"
                step="0.01"
              />
              {product.error?.weight && (
                <FormMessage>{product.error.weight}</FormMessage>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeProduct(product.id)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        onClick={addProduct}
        className="w-full text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar novo produto
      </Button>
    </div>
  );
  }
);

ProductsTab.displayName = "ProductsTab";