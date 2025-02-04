import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdditionalInfoFormData, UpdateRNCFormData } from "@/schemas/rncValidation";

export type AdditionalInfoTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => AdditionalInfoFormData;
};

export const AdditionalInfoTab = ({ isEditing }: { isEditing: boolean }) => {
  const { control } = useFormContext<UpdateRNCFormData>();

  return (
      <div className="space-y-4">
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
                    className="min-h-[100px] border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="korp"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="korp" className="flex items-center gap-1">
                  Número do pedido (KORP) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    disabled={!isEditing}
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
                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      if (!e.target.value) {
                        return;
                      }
                      const date = new Date(e.target.value);
                      if (isNaN(date.getTime())) {
                        field.onChange(date.toISOString());
                      }
                    }}
                    disabled={!isEditing}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
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
                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      if (!e.target.value) {
                        return;
                      }
                      const date = new Date(e.target.value);
                      if (isNaN(date.getTime())) {
                        field.onChange(date.toISOString());
                      }
                    }}
                    disabled={!isEditing}
                    className="border-blue-200 focus:border-blue-400"
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
