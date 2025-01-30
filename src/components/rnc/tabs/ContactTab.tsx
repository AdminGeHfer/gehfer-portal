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
    const form = useForm<ContactFormData>({
      resolver: zodResolver(contactSchema),
      defaultValues: {
        name: "",
        phone: "",
        email: "",
      }
    });

    // Save form data to localStorage whenever it changes
    React.useEffect(() => {
      const subscription = form.watch((data) => {
        const currentData = localStorage.getItem('rncFormData');
        const parsedData = currentData ? JSON.parse(currentData) : {};
        localStorage.setItem('rncFormData', JSON.stringify({
          ...parsedData,
          contact: data
        }));
      });
      return () => subscription.unsubscribe();
    }, [form.watch]);

    React.useEffect(() => {
      const values = form.watch();
      const requiredFields = ["name", "phone"];
      const filledRequired = requiredFields.filter(field => values[field as keyof typeof values]).length;
      setProgress((filledRequired / requiredFields.length) * 100);
    }, [form.watch(), setProgress]);

    React.useImperativeHandle(ref, () => ({
      validate: () => form.trigger(),
      getFormData: () => {
        const values = form.getValues();
        return {
          name: values.name,
          phone: values.phone,
          email: values.email || "",
        };
      },
      setFormData: (data) => {
        if (data) {
          form.reset(data);
        }
      }
    }));

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