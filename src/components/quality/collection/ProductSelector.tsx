import { Check } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductSelectorProps {
  products: any[];
  selectedProductId: string;
  productName?: string;
  onSelect: (productId: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductSelector({
  products,
  selectedProductId,
  productName,
  onSelect,
  isOpen,
  onOpenChange
}: ProductSelectorProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !selectedProductId && "text-muted-foreground"
          )}
          type="button"
        >
          {productName || "Selecione o produto"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" side="bottom" align="start">
        <Command>
          <CommandInput placeholder="Buscar produto..." />
          <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {products?.map((product) => (
              <CommandItem
                key={product.id}
                value={product.name}
                onSelect={() => onSelect(product.id)}
                className="cursor-pointer hover:bg-accent"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedProductId === product.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {product.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}