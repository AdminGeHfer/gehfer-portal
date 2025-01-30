import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handlePhoneChange } from "@/utils/masks";
import { contactSchema } from "@/utils/validations";
import type { z } from "zod";

interface ContactTabProps {
  setProgress: (progress: number) => void;
}

export type ContactFormData = z.infer<typeof contactSchema>;

export type ContactTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => z.infer<typeof contactSchema>;
  setFormData: (data) => void;
};

export const ContactTab = React.forwardRef<ContactTabRef, ContactTabProps>(
  ({ setProgress }, ref) => {
    console.log('ContactTab mounted');
    
    const form = useForm<ContactFormData>({
      resolver: zodResolver(contactSchema),
      defaultValues: {
        name: "",
        phone: "",
        email: "",
      }
    });

    const { watch } = form;

    const formMethods = React.useMemo(
      () => ({
        validate: async () => {
          try {
            console.log('Validating ContactTab...');
            const result = await form.trigger();
            console.log('Contact validation result:', result);
            console.log('Current form values:', form.getValues());
            return result;
          } catch (error) {
            console.error('Contact validation error:', error);
            return false;
          }
        },
        getFormData: () => {
          try {
            const values = form.getValues();
            console.log('Getting contact form data:', values);
            return values;
          } catch (error) {
            console.error('Error getting contact form data:', error);
            throw error;
          }
        },
        setFormData: (data: Partial<ContactFormData>) => {
          try {
            console.log('Setting contact form data:', data);
            form.reset(data);
          } catch (error) {
            console.error('Error setting contact form data:', error);
          }
        }
      }),
      [form]
    );

    React.useEffect(() => {
      console.log('ContactTab ref methods exposed');
    }, []);

    React.useImperativeHandle(ref, () => formMethods, [formMethods]);

    const saveFormData = React.useCallback((data: ContactFormData) => {
      try {
        const currentData = localStorage.getItem('rncFormData');
        const parsedData = currentData ? JSON.parse(currentData) : {};
        localStorage.setItem('rncFormData', JSON.stringify({
          ...parsedData,
          contact: data
        }));
        console.log('Saved contact data:', data);
      } catch (error) {
        console.error('Error saving contact data:', error);
      }
    }, []);

    React.useEffect(() => {
      const subscription = watch((data) => {
        saveFormData(data as ContactFormData);
        const requiredFields = ["name", "phone"];
        const filledRequired = requiredFields.filter(field => data[field as keyof typeof data]).length;
        setProgress((filledRequired / requiredFields.length) * 100);
      });
      return () => subscription.unsubscribe();
    }, [watch, saveFormData, setProgress]);

    return (
      <Form {...form}>
        <form className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Nome
                  <span className="text-blue-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} className="border-blue-200 focus:border-blue-400" placeholder="Digite o nome do contato" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Telefone
                  <span className="text-blue-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="border-blue-200 focus:border-blue-400" 
                    placeholder="Digite o número de telefone"
                    onChange={(e) => handlePhoneChange(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" className="border-blue-200 focus:border-blue-400" placeholder="Digite o email" />
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

ContactTab.displayName = "ContactTab";