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
    // Use form directly like in ProductsTab
    const form = useForm<AdditionalInfoFormData>({
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

    const { watch } = form;

    const formMethods = React.useMemo(
      () => ({
        validate: async () => {
          try {
            const result = await form.trigger();
            console.log('Additional Info validation result:', result);
            console.log('Current form values:', form.getValues());
            return result;
          } catch (error) {
            console.error('Additional validation error:', error);
            return false;
          }
        },
        getFormData: () => {
          try {
            const values = form.getValues();
            console.log('Getting Additional form data:', values);
            return values;
          } catch (error) {
            console.error('Error getting Additional form data:', error);
            throw error;
          }
        },
        setFormData: (data: Partial<AdditionalInfoFormData>) => {
          try {
            console.log('Setting basic form data:', data);
            form.reset(data);
          } catch (error) {
            console.error('Error setting basic form data:', error);
          }
        }
      }),
      [form]
    );

    const saveFormData = React.useCallback((data: AdditionalInfoFormData) => {
      try {
        const currentData = localStorage.getItem('rncFormData');
        const parsedData = currentData ? JSON.parse(currentData) : {};
        localStorage.setItem('rncFormData', JSON.stringify({
          ...parsedData,
          additional: data
        }));
        console.log('Saved additional data:', data);
      } catch (error) {
        console.error('Error saving additional data:', error);
      }
    }, []);

    React.useEffect(() => {
      const subscription = watch((data) => {
        saveFormData(data as AdditionalInfoFormData);
        const requiredFields = ["description", "korp", "nfv"];
        const filledRequired = requiredFields.filter(field => data[field as keyof typeof data]).length;
        setProgress((filledRequired / requiredFields.length) * 100);
      });
      return () => subscription.unsubscribe();
    }, [watch, saveFormData, setProgress]);

    React.useImperativeHandle(ref, () => formMethods, [formMethods]);

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