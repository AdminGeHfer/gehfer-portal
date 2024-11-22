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

interface RNCCompanyInfoProps {
  form: UseFormReturn<RNCFormData>;
}

export const RNCCompanyInfo = ({ form }: RNCCompanyInfoProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300">Razão Social</FormLabel>
            <FormControl>
              <Input 
                placeholder="Nome da empresa" 
                className="bg-[#1e2330] border-gray-700 text-white"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="cnpj"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300">CNPJ</FormLabel>
            <FormControl>
              <Input 
                placeholder="00.000.000/0000-00" 
                maxLength={14} 
                className="bg-[#1e2330] border-gray-700 text-white"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="orderNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300">Nº do Pedido</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite o número do pedido" 
                className="bg-[#1e2330] border-gray-700 text-white"
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