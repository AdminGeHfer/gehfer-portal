import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { additionalInfoSchema } from "@/utils/validations";

interface AdditionalInfoTabProps {
  isEditing: boolean;
  initialValues?: z.infer<typeof additionalInfoSchema>;
}

export type AdditionalInfoFormData = z.infer<typeof additionalInfoSchema>;

export type AdditionalInfoTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => AdditionalInfoFormData;
};

export const AdditionalInfoTab = React.forwardRef<AdditionalInfoTabRef, AdditionalInfoTabProps>(
  ({ isEditing, initialValues }, ref) => {
    const form = useForm<z.infer<typeof additionalInfoSchema>>({
      resolver: zodResolver(additionalInfoSchema),
      defaultValues: {
        description: initialValues?.description || "",
        korp: initialValues?.korp || "",
        nfv: initialValues?.nfv || "",
        nfd: initialValues?.nfd || "",
        city: initialValues?.city || "",
        conclusion: initialValues?.conclusion || "",
        collected_at: initialValues?.collected_at ? new Date(initialValues.collected_at).toDateString() : null,
        closed_at: initialValues?.closed_at ? new Date(initialValues.closed_at).toDateString() : null,
      },
    });

    React.useEffect(() => {
      if (initialValues) {
        form.reset(initialValues);
      }
    }, [initialValues, form]);

    React.useImperativeHandle(ref, () => ({
      validate: () => form.trigger(),
      getFormData: () => form.getValues()
    }));

    return (
      <Form {...form}>
        <form className="space-y-4">
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
                      value={field.value || ""}
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
                      value={field.value || ""}
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
                      value={field.value || ""}
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
                      value={field.value || ""}
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
                      value={field.value || ""}
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
                    value={field.value || ""}
                    disabled={!isEditing}
                    className="min-h-[100px] border-blue-200 focus:border-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  }
);

AdditionalInfoTab.displayName = "AdditionalInfoTab";
