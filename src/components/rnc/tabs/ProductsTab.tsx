import * as React from "react";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  weight: string;
}

interface ProductsTabProps {
  setProgress: (progress: number) => void;
}

export function ProductsTab({ setProgress }: ProductsTabProps) {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "", weight: "" },
  ]);

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
      products.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  React.useEffect(() => {
    const filledProducts = products.filter(p => p.name && p.weight).length;
    setProgress(products.length > 0 ? (filledProducts / products.length) * 100 : 0);
  }, [products, setProgress]);

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-[1fr,1fr,auto] gap-4">
        <div className="font-medium text-sm text-blue-900 dark:text-blue-100">Produto</div>
        <div className="font-medium text-sm text-blue-900 dark:text-blue-100">Peso</div>
        <div></div>
      </div>

      {products.map((product) => (
        <div key={product.id} className="grid grid-cols-[1fr,1fr,auto] gap-4">
          <Input
            value={product.name}
            onChange={(e) => updateProduct(product.id, "name", e.target.value)}
            placeholder="Digite o nome do produto"
            className="border-blue-200 focus:border-blue-400"
          />
          <Input
            value={product.weight}
            onChange={(e) => updateProduct(product.id, "weight", e.target.value)}
            placeholder="Peso do produto (kg)"
            className="border-blue-200 focus:border-blue-400"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeProduct(product.id)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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