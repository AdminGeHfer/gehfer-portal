import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

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
    name: string;
    email: string;
    modules: string[];
    active: boolean;
  };
}

export function UserForm({ user }: UserFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
      // TODO: Implement user creation/update with Supabase
      toast({
        title: user ? "Usuário atualizado" : "Usuário criado",
        description: `O usuário ${data.name} foi ${user ? "atualizado" : "criado"} com sucesso.`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o usuário.",
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