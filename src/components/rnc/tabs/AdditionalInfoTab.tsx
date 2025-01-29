import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { additionalInfoSchema } from "@/utils/validations";
import type { z } from "zod";

interface AdditionalInfoTabProps {
  setProgress: (progress: number) => void;
}

export type AdditionalInfoFormData = z.infer<typeof additionalInfoSchema>;

export type AdditionalInfoTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => AdditionalInfoFormData;
  setFormData: (data: Partial<AdditionalInfoFormData>) => void;
};

export const AdditionalInfoTab = React.forwardRef<AdditionalInfoTabRef, AdditionalInfoTabProps>(
  ({ setProgress }, ref) => {
    const form = useForm<z.infer<typeof additionalInfoSchema>>({
      resolver: zodResolver(additionalInfoSchema),
      defaultValues: {
        description: "",
        korp: "",
        nfv: "",
        nfd: "",
        city: ""
      },
    
    });

    // Save form data to localStorage whenever it changes
    React.useEffect(() => {
      const subscription = form.watch((data) => {
        const currentData = localStorage.getItem('rncFormData');
        const parsedData = currentData ? JSON.parse(currentData) : {};
        localStorage.setItem('rncFormData', JSON.stringify({
          ...parsedData,
          additional: data
        }));
      });
      return () => subscription.unsubscribe();
    }, [form.watch]);

    React.useEffect(() => {
      const values = form.watch();
      const requiredFields = ["description", "korp", "nfv"];
      const filledRequired = requiredFields.filter(field => values[field as keyof typeof values]).length;
      setProgress((filledRequired / requiredFields.length) * 100);
    }, [form.watch(), setProgress]);

    React.useImperativeHandle(ref, () => ({
      validate: () => form.trigger(),
      getFormData: () => form.getValues(),
      setFormData: (data) => form.reset(data)
    }));

  return (
    <Form {...form}>
      <form className="space-y-4 py-4">
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
          name="nfd"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                NFD
              </FormLabel>
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
          control={form.control}
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
      </form>
    </Form>
  );
  }
);

AdditionalInfoTab.displayName = "AdditionalInfoTab";