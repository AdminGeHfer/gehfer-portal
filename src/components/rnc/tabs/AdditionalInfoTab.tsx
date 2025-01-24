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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  korp: z.string().min(3, "Número do pedido deve ter no mínimo 3 caracteres"),
  nfv: z.string().min(3, "NFV deve ter no mínimo 3 caracteres"),
  nfd: z.string().min(3, "NFD deve ter no mínimo 3 caracteres"),
  city: z.string().min(3, "Cidade deve ter no mínimo 3 caracteres").optional(),
  conclusion: z.string().min(10, "Conclusão deve ter no mínimo 10 caracteres").optional(),
});

interface AdditionalInfoTabProps {
  setProgress: (progress: number) => void;
}

export function AdditionalInfoTab({ setProgress }: AdditionalInfoTabProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      korp: "",
      nfv: "",
      nfd: "",
      city: "",
      conclusion: "",
    },
  });

  React.useEffect(() => {
    const values = form.watch();
    const requiredFields = ["description", "korp", "nfv", "nfd"];
    const filledRequired = requiredFields.filter(field => values[field as keyof typeof values]).length;
    setProgress((filledRequired / requiredFields.length) * 100);
  }, [form.watch(), setProgress]);

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
                <span className="text-blue-400">*</span>
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