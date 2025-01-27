import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/atoms/Button";
import { Plus, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { handlePhoneChange } from "@/utils/masks";

const relationalInfoSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  phone: z.string().min(10, "Telefone deve ter no mínimo 10 caracteres"),
  email: z.string().email("Email inválido").optional(),
});

interface RelationalInfoTabProps {
  isEditing: boolean;
}

export type RelationalInfoTabRef = {
  validate: () => Promise<boolean>;
};

export const RelationalInfoTab = React.forwardRef<RelationalInfoTabRef, RelationalInfoTabProps>(
  ({ isEditing }, ref) => {
    const form = useForm<z.infer<typeof relationalInfoSchema>>({
      resolver: zodResolver(relationalInfoSchema),
      defaultValues: {
        name: "",
        phone: "",
        email: "",
      },
    });

    // Save form data to localStorage whenever it changes
    React.useEffect(() => {
      const subscription = form.watch((data) => {
        const currentData = localStorage.getItem('rncDetailsData');
        const parsedData = currentData ? JSON.parse(currentData) : {};
        localStorage.setItem('rncDetailsData', JSON.stringify({
          ...parsedData,
          relational: data
        }));
      });
      return () => subscription.unsubscribe();
    }, [form.watch]);

    React.useImperativeHandle(ref, () => ({
      validate: () => {
        return form.trigger();
      },
    }));

    const handleAddProduct = () => {
      // Add product logic here
      console.log("Adding product...");
    };

    return (
      <div className="space-y-8 p-4">
        {/* Products Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Produtos</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Peso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Produto A</TableCell>
                <TableCell>100kg</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleAddProduct}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          )}
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contato</h3>
          <Form {...form}>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Nome
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Telefone
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        className="border-blue-200 focus:border-blue-400"
                        onChange={(e) => handlePhoneChange(e, field.onChange)}
                      />
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
                      <Input
                        {...field}
                        type="email"
                        disabled={!isEditing}
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        {/* Attachments Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Anexos</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span>documento1.pdf</span>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                onClick={() => {
                  // Handle file upload
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Anexo
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

RelationalInfoTab.displayName = "RelationalInfoTab";