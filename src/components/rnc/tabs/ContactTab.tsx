import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handlePhoneChange } from "@/utils/masks";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  phone: z.string().regex(
    /\([0-9]{2}\)\s?[0-9]{4,5}-?[0-9]{3,4}/,
    "Telefone inválido. Use o formato (99) 99999-9999"
  ),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

interface ContactTabProps {
  setProgress: (progress: number) => void;
}

export type ContactTabRef = {
  validate: () => Promise<boolean>;
};

export const ContactTab = React.forwardRef<ContactTabRef, ContactTabProps>(
  ({ setProgress }, ref) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        phone: "",
        email: "",
      },
    });

    React.useEffect(() => {
      const values = form.watch();
      const requiredFields = ["name", "phone"];
      const filledRequired = requiredFields.filter(field => values[field as keyof typeof values]).length;
      setProgress((filledRequired / requiredFields.length) * 100);
    }, [form.watch(), setProgress]);

    React.useImperativeHandle(ref, () => ({
      validate: () => {
        return form.trigger().then((isValid) => {
          return isValid;
        });
      },
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
