import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";

interface RNCContactInfoProps {
  form: UseFormReturn<RNCFormData>;
}

export const RNCContactInfo = ({ form }: RNCContactInfoProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="contact.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Contato *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite o nome do contato" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
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
              <Input 
                placeholder="Digite o telefone (opcional)" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
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
              <Input 
                type="email" 
                placeholder="Digite o email (opcional)" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};