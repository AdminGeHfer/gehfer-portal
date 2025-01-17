import * as React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

interface RNCOrderInfoProps {
  form: UseFormReturn<RNCFormData>;
  isEditing?: boolean;
}

export const RNCOrderInfo = ({ form, isEditing = false }: RNCOrderInfoProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products"
  });

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="products"
        render={() => (
          <FormItem className="space-y-2">
            <FormLabel>Produtos e Pesos</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Peso (kg)</TableHead>
                      {isEditing && <TableHead className="w-[100px]">Ações</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Input
                            {...form.register(`products.${index}.product`)}
                            placeholder="Nome do produto"
                            disabled={!isEditing}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            {...form.register(`products.${index}.weight`, {
                              valueAsNumber: true,
                            })}
                            placeholder="Peso em kg"
                            disabled={!isEditing}
                          />
                        </TableCell>
                        {isEditing && (
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
                    ))}
                  </TableBody>
                </Table>
                {isEditing && (
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="korp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número do pedido</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Número do pedido (KORP)"
                className="min-h-[100px]"
                {...field}
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nfv"
        render={({ field }) => (
          <FormItem>
            <FormLabel>NFV</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Número da Nota de Venda"
                className="min-h-[100px]"
                {...field}
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nfd"
        render={({ field }) => (
          <FormItem>
            <FormLabel>NFD</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Número da Nota de Devolução"
                className="min-h-[100px]"
                {...field}
                disabled={!isEditing}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};