import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdditionalInfoFormData, UpdateRNCFormData } from "@/schemas/rncValidation";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export type AdditionalInfoTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => AdditionalInfoFormData;
};

export const AdditionalInfoTab = ({ isEditing }: { isEditing: boolean }) => {
  const { control } = useFormContext<UpdateRNCFormData>();
  
  const formatDateForInput = (date: string | null) => {
    if (!date) return '';
    try {
      return format(parseISO(date), 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  const formatDateForDisplay = (date: string | null) => {
    if (!date) return '';
    try {
      return format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return '';
    }
  };

  return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="korp"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="korp" className="flex items-center gap-1">
                  Número do pedido (Korp) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    disabled={!isEditing}
                    placeholder="Digite o número do pedido (Korp)"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="nfv"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="nfv" className="flex items-center gap-1">
                  NFV <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    disabled={!isEditing}
                    placeholder="Digite o número da nota fiscal de venda"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="nfd"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="nfd">NFD</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    disabled={!isEditing}
                    placeholder="Digite o número da nota fiscal de devolução"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="city">Cidade</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    disabled={!isEditing}
                    placeholder="Digite o nome da cidade"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="collected_at"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-4">
                <FormLabel htmlFor="collected_at">Data para Coleta</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={formatDateForInput(field.value)}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value) {
                        field.onChange(null);
                        return;
                      }
                      try {
                        const date = new Date(value);
                        if (!isNaN(date.getTime())) {
                          field.onChange(date.toISOString());
                        }
                      } catch (error) {
                        console.error('Invalid date:', error);
                      }
                    }}
                    disabled={!isEditing}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
                {field.value && (
                  <span className="text-sm text-gray-500">
                    {formatDateForDisplay(field.value)}
                  </span>
                )}
            <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="closed_at"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-4">
                <FormLabel htmlFor="closed_at">Data Final</FormLabel>
                <FormControl>
                  <Input
                      type="date"
                      {...field}
                      value={formatDateForInput(field.value)}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!value) {
                          field.onChange(null);
                          return;
                        }
                        try {
                          const date = new Date(value);
                          if (!isNaN(date.getTime())) {
                            field.onChange(date.toISOString());
                          }
                        } catch (error) {
                          console.error('Invalid date:', error);
                        }
                      }}
                      disabled={!isEditing}
                      className="border-blue-200 focus:border-blue-400"
                    />
                </FormControl>
                {field.value && (
                  <span className="text-sm text-gray-500">
                    {formatDateForDisplay(field.value)}
                  </span>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="description" className="flex items-center gap-1">
                  Descrição <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    disabled={!isEditing}
                    placeholder="Digite a descrição da RNC"
                    className="min-h-[100px] border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={control}
            name="resolution"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="resolution" className="flex items-center gap-1">
                  Resolução
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    disabled={!isEditing}
                    placeholder="Digite a resolução da RNC"
                    className="min-h-[100px] border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="conclusion"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="conclusion">Conclusão Final</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  disabled={!isEditing}
                  placeholder="Digite a conclusão final da RNC"
                  className="min-h-[100px] border-blue-200 focus:border-blue-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
  );
};

AdditionalInfoTab.displayName = "AdditionalInfoTab";
