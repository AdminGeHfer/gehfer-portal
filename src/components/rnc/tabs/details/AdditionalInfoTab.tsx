import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactDatePicker from "react-datepicker";
import { AdditionalInfoFormData, additionalInfoSchema } from "@/schemas/rncValidation";

interface AdditionalInfoTabProps {
  isEditing: boolean;
  initialValues?: {
    description: string;
    korp: string;
    nfv: string;
    nfd?: string | null;
    city?: string | null;
    collected_at?: string | null;
    closed_at?: string | null;
    conclusion?: string | null;
  };
}

export type AdditionalInfoTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => AdditionalInfoFormData;
};

export const AdditionalInfoTab = React.forwardRef<AdditionalInfoTabRef, AdditionalInfoTabProps>(
  ({ isEditing, initialValues }, ref) => {
    const form = useForm<AdditionalInfoFormData>({
      resolver: zodResolver(additionalInfoSchema),
      defaultValues: initialValues
    });

    React.useImperativeHandle(ref, () => ({
      validate: () => form.trigger(),
      getFormData: () => form.getValues()
    }));

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description" className="flex items-center gap-1">
                Descrição <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
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
          control={form.control}
          name="korp"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="korp" className="flex items-center gap-1">
                Número do pedido (KORP) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!isEditing}
                  className="border-blue-200 focus:border-blue-400"
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
              <FormLabel htmlFor="nfv" className="flex items-center gap-1">
                NFV <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!isEditing}
                  className="border-blue-200 focus:border-blue-400"
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
              <FormLabel htmlFor="nfd">NFD</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!isEditing}
                  className="border-blue-200 focus:border-blue-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="city">Cidade</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!isEditing}
                  className="border-blue-200 focus:border-blue-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="collected_at"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-4">
              <FormLabel htmlFor="collected_at">Data para Coleta</FormLabel>
              <FormControl>
                <ReactDatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date: Date) => field.onChange(date?.toISOString() || "")}
                  disabled={!isEditing}
                  className="border border-blue-200 rounded-lg p-2 focus:border-blue-400 focus:ring focus:ring-blue-200 w-full"
                  dateFormat="dd/MM/yyyy"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="closed_at"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-4">
              <FormLabel htmlFor="closed_at">Data Final</FormLabel>
              <FormControl>
                <ReactDatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date: Date) => field.onChange(date?.toISOString() || "")}
                  disabled={!isEditing}
                  className="border border-blue-200 rounded-lg p-2 focus:border-blue-400 focus:ring focus:ring-blue-200 w-full"
                  dateFormat="dd/MM/yyyy"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="conclusion"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="conclusion">Conclusão Final</FormLabel>
            <FormControl>
              <Textarea
                {...field}
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
},
);

AdditionalInfoTab.displayName = "AdditionalInfoTab";
