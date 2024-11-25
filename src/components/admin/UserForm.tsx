import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const userFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
  modules: z.array(z.string()),
  active: z.boolean()
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user?: {
    id: string;
    name: string | null;
    email: string | null;
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
      modules: user?.modules || [],
      active: user?.active ?? true
    }
  });

  async function onSubmit(data: UserFormValues) {
    setIsLoading(true);
    try {
      if (user) {
        // Update existing user
        const { error } = await supabase
          .from('profiles')
          .update({
            name: data.name,
            email: data.email,
            modules: data.modules,
            active: data.active
          })
          .eq('id', user.id);

        if (error) throw error;

        toast({
          title: "Usuário atualizado",
          description: `O usuário ${data.name} foi atualizado com sucesso.`
        });
      } else {
        // Create new user with auth
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

        // Update the profile with additional data
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              modules: data.modules,
              active: data.active
            })
            .eq('id', authData.user.id);

          if (profileError) throw profileError;
        }

        toast({
          title: "Usuário criado",
          description: `O usuário ${data.name} foi criado com sucesso.`
        });
      }

      // Refresh users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar o usuário.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  const availableModules = [
    { id: "quality", label: "Qualidade" },
    { id: "admin", label: "Administração" }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!user && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="modules"
          render={() => (
            <FormItem>
              <FormLabel>Módulos</FormLabel>
              <div className="space-y-2">
                {availableModules.map((module) => (
                  <FormField
                    key={module.id}
                    control={form.control}
                    name="modules"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(module.id)}
                            onCheckedChange={(checked) => {
                              const updatedModules = checked
                                ? [...field.value || [], module.id]
                                : field.value?.filter((value) => value !== module.id) || [];
                              field.onChange(updatedModules);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {module.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Usuário ativo
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Salvando..." : user ? "Atualizar Usuário" : "Criar Usuário"}
        </Button>
      </form>
    </Form>
  );
}