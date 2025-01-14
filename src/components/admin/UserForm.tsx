import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { UserFormFields } from "./UserFormFields";
import { Role } from "@/hooks/useRBAC";

const userFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
  role: z.enum(["admin", "manager", "user"] as const),
  modules: z.array(z.string()).min(1, "Selecione pelo menos um módulo"),
  active: z.boolean()
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    role: Role | null;
    modules: string[] | null;
    active: boolean | null;
  };
  onSuccess?: () => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "user",
      modules: user?.modules || [],
      active: user?.active ?? true
    }
  });

  async function onSubmit(data: UserFormValues) {
    setIsLoading(true);
    try {
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: data.name,
            email: data.email,
            role: data.role,
            modules: data.modules,
            active: data.active
          })
          .eq('id', user.id);

        if (error) throw error;

        toast({
          title: "Usuário atualizado",
          description: `O usuário ${data.name} foi atualizado com sucesso.`,
          variant: "default"
        });
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password!,
          options: {
            data: {
              name: data.name,
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              role: data.role,
              modules: data.modules,
              active: data.active
            })
            .eq('id', authData.user.id);

          if (profileError) throw profileError;
        }

        toast({
          title: "Usuário criado",
          description: `O usuário ${data.name} foi criado com sucesso.`,
          variant: "default"
        });
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const e = error as Error;
      toast({
        title: "Erro",
        description: e.message || "Ocorreu um erro ao salvar o usuário.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <UserFormFields form={form} isEditing={!!user} />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Salvando..." : user ? "Atualizar Usuário" : "Criar Usuário"}
        </Button>
      </form>
    </Form>
  );
}