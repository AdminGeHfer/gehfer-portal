import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

const additionalInfoSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  korp: z.string().min(1, "Número do pedido é obrigatório"),
  nfv: z.string().min(1, "NFV é obrigatória"),
  nfd: z.string().min(3, "NFD deve ter no mínimo 3 caracteres").optional().or(z.literal('')),
  city: z.string().min(3, "A cidade deve ter no mínimo 3 caracteres").optional().or(z.literal('')),
  conclusion: z.string().min(3, "A conclusão deve ter no mínimo 10 caracteres").optional().or(z.literal('')),
});

interface AdditionalInfoTabProps {
  isEditing: boolean;
}

export type AdditionalInfoTabRef = {
  validate: () => Promise<boolean>;
};

export const AdditionalInfoTab = React.forwardRef<AdditionalInfoTabRef, AdditionalInfoTabProps>(
  ({ isEditing }, ref) => {
    const form = useForm<z.infer<typeof additionalInfoSchema>>({
      resolver: zodResolver(additionalInfoSchema),
      defaultValues: {
        description: "",
        korp: "",
        nfv: "",
        nfd: "",
        city: "",
        conclusion: "",
      },
    });

    React.useImperativeHandle(ref, () => ({
      validate: () => {
        return form.trigger();
      },
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
        </form>
      </Form>
    );
  }
);

AdditionalInfoTab.displayName = "AdditionalInfoTab";