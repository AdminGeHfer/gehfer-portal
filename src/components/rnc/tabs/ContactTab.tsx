import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handlePhoneChange } from "@/utils/masks";
import { contactSchema } from "@/utils/validations";
import { CreateRNCContact } from "@/types/rnc";
import type { z } from "zod";

export type ContactFormData = z.infer<typeof contactSchema>;

export type ContactTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => CreateRNCContact;
  setFormData: (data: Partial<ContactFormData>) => void;
};

export const ContactTab = () => {
  const { control } = useFormContext();

    return (
        <div className="space-y-4 py-4">
          <FormField
            control={control}
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
            control={control}
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
            control={control}
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
        </div>
    );
  }

ContactTab.displayName = "ContactTab";
