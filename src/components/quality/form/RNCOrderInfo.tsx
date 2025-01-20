import * as React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";
import Subtitle from "@/components/quality/form/Subtitle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

interface RNCOrderInfoProps {
  form: UseFormReturn<RNCFormData>;
  showErrors?: boolean;
}

export const RNCOrderInfo = ({ form, showErrors = false }: RNCOrderInfoProps) => {
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
            <FormLabel className="required-field">Produtos e Pesos</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Peso (kg)</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Input
                            {...form.register(`products.${index}.product`)}
                            placeholder="Nome do produto"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            {...form.register(`products.${index}.weight`, {
                              valueAsNumber: true,
                            })}
                            placeholder="Peso em kg"
                          />
                        </TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ product: "", weight: 0 })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="korp"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="required-field">Número do Pedido</FormLabel>
            <FormControl>
              <Input 
                placeholder="Número do pedido (KORP)" 
                {...field} 
              />
            </FormControl>
            {(showErrors || fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nfv"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="required-field">NFV</FormLabel>
            <FormControl>
              <Input 
                placeholder="Número da Nota de Venda" 
                {...field} 
              />
            </FormControl>
            {(showErrors || fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nfd"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>NFD</FormLabel>
            <FormControl>
              <Input 
                placeholder="Número da Nota de Devolução" 
                {...field} 
              />
            </FormControl>
            {(showErrors || fieldState.isTouched) && <FormMessage className="form-message" />}
          </FormItem>
        )}
      />
    <Subtitle text="* Campos obrigatórios" color="skyblue" />
    </div>
  );
};