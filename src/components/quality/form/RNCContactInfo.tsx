import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";

export interface RNCContactInfoProps {
  form: UseFormReturn<RNCFormData>;
  showErrors?: boolean;
}

export function RNCContactInfo({ form, showErrors = true }: RNCContactInfoProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="contact.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Contato *</FormLabel>
            <FormControl>
              <Input placeholder="Digite o nome do contato" {...field} />
            </FormControl>
            {showErrors && <FormMessage />}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Digite o email do contato" {...field} type="email" />
            </FormControl>
            {showErrors && <FormMessage />}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input placeholder="Digite o telefone do contato" {...field} />
            </FormControl>
            {showErrors && <FormMessage />}
          </FormItem>
        )}
      />
    </div>
  );
}