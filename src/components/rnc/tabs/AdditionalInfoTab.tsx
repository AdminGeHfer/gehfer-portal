import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { additionalInfoSchema } from "@/utils/validations";
import type { z } from "zod";

export type AdditionalInfoFormData = z.infer<typeof additionalInfoSchema>;

export type AdditionalInfoTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => AdditionalInfoFormData;
  setFormData: (data: Partial<AdditionalInfoFormData>) => void;
};

export const AdditionalInfoTab = () => {
  const { control } = useFormContext();

    return (
        <div className="space-y-4 py-4">
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Descrição
                  <span className="text-blue-400">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    className="min-h-[100px] border-blue-200 focus:border-blue-400"
                    placeholder="Descrição sobre a RNC..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="korp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Número do pedido
                  <span className="text-blue-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} className="border-blue-200 focus:border-blue-400" placeholder="Digite o número do pedido (KORP)" />
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
                <FormLabel className="flex items-center gap-1">
                  NFV
                  <span className="text-blue-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
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
                <FormLabel>NFD</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
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
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} className="border-blue-200 focus:border-blue-400" placeholder="Digite o nome da cidade" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
    );
  }

AdditionalInfoTab.displayName = "AdditionalInfoTab";
