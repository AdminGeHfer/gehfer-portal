import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Plus } from "lucide-react";
import { FieldArrayWithId, useFieldArray, UseFieldArrayRemove, UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";

interface ProductsTableProps {
  form: UseFormReturn<RNCFormData>;
  fields: FieldArrayWithId<RNCFormData, "products", "id">[];
  canEdit: boolean;
  onRemove: UseFieldArrayRemove;
}

export function ProductsTable({ form, canEdit }: ProductsTableProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Peso (kg)</TableHead>
            {canEdit && <TableHead className="w-[100px]">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.length > 0 ? (
            fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <Input
                    {...form.register(`products.${index}.product`)}
                    placeholder="Nome do produto"
                    defaultValue={field.product || ""}
                    disabled={!canEdit}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    {...form.register(`products.${index}.weight`, {
                      valueAsNumber: true,
                    })}
                    placeholder="Peso em kg"
                    defaultValue={field.weight || 0}
                    disabled={!canEdit}
                  />
                </TableCell>
                {canEdit && (
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={canEdit ? 3 : 2} className="text-center">
                Nenhum produto foi encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {canEdit && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ product: "", weight: 0 })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      )}
    </div>
  );
}