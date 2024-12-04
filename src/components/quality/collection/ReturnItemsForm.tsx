import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductSelector } from "./ProductSelector";

type FormItem = {
  productId: string;
  weight: number;
  productName?: string;
};

interface ReturnItemsFormProps {
  onSubmit: (items: { product_id: string; weight: number }[]) => Promise<void>;
  isSubmitting: boolean;
}

export function ReturnItemsForm({ onSubmit, isSubmitting }: ReturnItemsFormProps) {
  const [items, setItems] = useState<FormItem[]>([
    { productId: "", weight: 0 },
  ]);
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number>(-1);

  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq('active', true)
        .order("name");

      if (error) {
        toast.error("Erro ao carregar produtos");
        throw error;
      }
      return data;
    },
  });

  const handleAddItem = () => {
    setItems([...items, { productId: "", weight: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSelectProduct = (index: number, productId: string) => {
    const product = products?.find(p => p.id === productId);
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId: productId,
      productName: product?.name
    };
    setItems(newItems);
    setOpenPopoverIndex(-1);
  };

  const handleWeightChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      weight: Number(value)
    };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const hasInvalidItems = items.some(item => !item.productId || item.weight <= 0);
    if (hasInvalidItems) {
      toast.error("Por favor, preencha todos os campos corretamente");
      return;
    }

    const validItems = items.map((item) => ({
      product_id: item.productId,
      weight: item.weight,
    }));

    await onSubmit(validItems);
  };

  if (isProductsLoading) {
    return <div>Carregando produtos...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Produto</Label>
              <ProductSelector
                products={products || []}
                selectedProductId={item.productId}
                productName={item.productName}
                onSelect={(productId) => handleSelectProduct(index, productId)}
                isOpen={openPopoverIndex === index}
                onOpenChange={(isOpen) => setOpenPopoverIndex(isOpen ? index : -1)}
              />
            </div>
            <div className="flex-1">
              <Label>Peso do Material (kg)</Label>
              <Input
                type="number"
                value={item.weight}
                onChange={(e) => handleWeightChange(index, e.target.value)}
                min={0}
                step="0.01"
              />
            </div>
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddItem}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Item
      </Button>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}