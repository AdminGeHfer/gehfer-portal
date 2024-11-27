import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { toast } from "sonner";

interface ReturnItemsFormProps {
  onSubmit: (items: { product_id: string; weight: number }[]) => Promise<void>;
  isSubmitting: boolean;
}

type FormItem = {
  productId: string;
  weight: number;
  productName?: string;
};

export function ReturnItemsForm({ onSubmit, isSubmitting }: ReturnItemsFormProps) {
  const [items, setItems] = useState<FormItem[]>([
    { productId: "", weight: 0 },
  ]);
  const [open, setOpen] = useState<number>(-1);

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

  const handleChange = (index: number, field: keyof FormItem, value: string | number) => {
    const newItems = [...items];
    if (field === "productId") {
      const product = products?.find(p => p.id === value);
      newItems[index] = {
        ...newItems[index],
        productId: value as string,
        productName: product?.name
      };
    } else if (field === "weight") {
      newItems[index] = {
        ...newItems[index],
        weight: Number(value)
      };
    }
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate that all items have a product selected and weight > 0
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
              <Popover open={open === index} onOpenChange={(isOpen) => setOpen(isOpen ? index : -1)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !item.productId && "text-muted-foreground"
                    )}
                  >
                    {item.productName || "Selecione o produto"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar produto..." />
                    <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                    <CommandGroup>
                      {products?.map((product) => (
                        <CommandItem
                          key={product.id}
                          value={product.name}
                          onSelect={() => {
                            handleChange(index, "productId", product.id);
                            setOpen(-1);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.productId === product.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {product.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <Label>Peso do Material (kg)</Label>
              <Input
                type="number"
                value={item.weight}
                onChange={(e) => handleChange(index, "weight", e.target.value)}
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