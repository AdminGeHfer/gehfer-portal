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

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido").optional(),
});

interface ContactTabProps {
  setProgress: (progress: number) => void;
}

export function ContactTab({ setProgress }: ContactTabProps) {
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
                <Input {...field} className="border-blue-200 focus:border-blue-400" placeholder="Digite o número de telefone" />
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