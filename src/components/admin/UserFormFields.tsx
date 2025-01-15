import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { Role } from "@/hooks/useRBAC";
import * as React from "react";

interface UserFormFieldsProps {
  form: UseFormReturn;
  isEditing?: boolean;
}

export function UserFormFields({ form, isEditing }: UserFormFieldsProps) {
  const availableModules = [
    { id: "quality", label: "Qualidade" },
    { id: "admin", label: "Administração" },
    { id: "portaria", label: "Portaria" }
  ];

  const roles: { value: Role; label: string }[] = [
    { value: "admin", label: "Administrador" },
    { value: "manager", label: "Gerente" },
    { value: "user", label: "Usuário" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome completo" {...field} />
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
                <Input placeholder="Digite o email" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {!isEditing && (
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input placeholder="Digite a senha" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Função</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <Card className="p-6">
        <FormField
          control={form.control}
          name="modules"
          render={() => (
            <FormItem>
              <FormLabel className="text-lg font-semibold mb-4">Módulos de Acesso</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableModules.map((module) => (
                  <FormField
                    key={module.id}
                    control={form.control}
                    name="modules"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 bg-secondary/10 p-4 rounded-lg">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(module.id)}
                            onCheckedChange={(checked) => {
                              const currentModules = field.value || [];
                              const updatedModules = checked
                                ? [...currentModules, module.id]
                                : currentModules.filter((value: string) => value !== module.id);
                              field.onChange(updatedModules);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-medium cursor-pointer">
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
      </Card>

      <FormField
        control={form.control}
        name="active"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2 bg-secondary/10 p-4 rounded-lg">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="font-medium cursor-pointer">
              Usuário ativo
            </FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}