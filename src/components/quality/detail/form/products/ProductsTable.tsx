import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData, RNCProduct } from "@/types/rnc";

interface ProductsTableProps {
  fields: RNCProduct[];
  canEdit: boolean;
  form: UseFormReturn<RNCFormData>;
  onRemove: (index: number) => void;
}

export function ProductsTable({ fields, canEdit, form, onRemove }: ProductsTableProps) {
  if (!fields || fields.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Nenhum produto foi encontrado
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>Peso (kg)</TableHead>
          {canEdit && <TableHead className="w-[100px]">Ações</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields.map((field, index) => (
          <TableRow key={field.id || index}>
            <TableCell>
              <Input
                {...form.register(`products.${index}.product`)}
                defaultValue={field.product}
                placeholder="Nome do produto"
                disabled={!canEdit}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                {...form.register(`products.${index}.weight`, {
                  valueAsNumber: true,
                })}
                defaultValue={field.weight}
                placeholder="Peso em kg"
                disabled={!canEdit}
              />
            </TableCell>
            {canEdit && (
              <TableCell>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}