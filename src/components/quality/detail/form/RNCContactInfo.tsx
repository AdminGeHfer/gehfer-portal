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
import { Button } from "@/components/ui/button";

interface RNCContactInfoProps {
  form: UseFormReturn<RNCFormData>;
  onSave?: (data: RNCFormData["contact"]) => Promise<void>;
  isSaving?: boolean;
}

export const RNCContactInfo = ({ form, onSave, isSaving = false }: RNCContactInfoProps) => {
  const handleSave = async () => {
    const contactData = form.getValues("contact");
    if (onSave && contactData) {
      await onSave(contactData);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="contact.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="required-field">Nome do Contato</FormLabel>
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
            <FormLabel className="required-field">Telefone</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite o telefone" 
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
            <FormLabel className="required-field">Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="Digite o email" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {onSave && (
        <div className="flex justify-end pt-4">
          <Button 
            type="button"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      )}
    </div>
  );
};