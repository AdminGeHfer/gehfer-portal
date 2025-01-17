import * as React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";
import Subtitle from "@/components/quality/form/Subtitle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RNCOrderInfoProps {
  form: UseFormReturn<RNCFormData>;
  showErrors?: boolean;
}

export const RNCOrderInfo = ({ form, showErrors = false }: RNCOrderInfoProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="product.product"
        render={({ field: productField, fieldState: productState }) => (
          <FormItem className="space-y-2">
            <FormLabel className="required-field">Produto e Peso</FormLabel>
            <FormControl>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Peso (kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Input 
                        placeholder="Nome do produto" 
                        {...productField}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="product.weight"
                        render={({ field: weightField, fieldState: weightState }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Peso em kg"
                                value={weightField.value as string | number}
                                {...weightField}
                                onChange={(e) => weightField.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            {(showErrors || weightState.isTouched) && <FormMessage className="form-message" />}
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </FormControl>
            {(showErrors || productState.isTouched) && <FormMessage className="form-message" />}
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