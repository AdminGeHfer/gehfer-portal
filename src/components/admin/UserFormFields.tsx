import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface UserFormFieldsProps {
  form: UseFormReturn<any>;
  isEditing?: boolean;
}

export function UserFormFields({ form, isEditing }: UserFormFieldsProps) {
  const availableModules = [
    { id: "quality", label: "Qualidade" },
    { id: "admin", label: "Administração" }
  ];

  return (
    <>
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

      {!isEditing && (
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
                              : field.value?.filter((value: string) => value !== module.id) || [];
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
    </>
  );
}