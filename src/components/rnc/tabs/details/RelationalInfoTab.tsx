import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/atoms/Button";
import { Plus, Trash2, FileIcon, Download } from "lucide-react";
import { z } from "zod";
import { handlePhoneChange } from "@/utils/masks";
import { rncService } from "@/services/rncService";
import { toast } from "sonner";
import { formatBytes } from "@/utils/format";
import { FileUploadField } from "@/components/portaria/FileUploadField";

interface RelationalInfoTabProps {
  rncId: string;
  isEditing: boolean;
  initialValues?: {
    name?: string;
    phone?: string;
    email?: string;
    products?: Array<{
      id: string;
      name: string;
      weight: number;
    }>;
    attachments?: Array<{
      id: string;
      rnc_id: string;
      filename: string;
      filesize: number;
      content_type: string;
      file_path: string;
      created_by: string;
      created_at: string;
    }>;
  };
}

export type RelationalInfoTabRef = {
  validate: () => Promise<boolean>;
};

const relationalInfoSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  phone: z.string().min(10, "Telefone inválido. Use o formato: (99) 99999-9999"),
  email: z.union([z.literal(""), z.string().email("Email inválido")]),
  products: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Nome do produto é obrigatório"),
    weight: z.number().min(0.1, "Peso deve ser maior que 0")
  })).min(1, "Pelo menos um produto deve ser adicionado")
});

export const RelationalInfoTab = React.forwardRef<RelationalInfoTabRef, RelationalInfoTabProps>(
  ({ rncId, isEditing, initialValues }, ref) => {
    const defaultValues = React.useMemo(() => ({
      name: initialValues?.name || "",
      phone: initialValues?.phone || "",
      email: initialValues?.email || "",
      products: initialValues?.products?.length
        ? initialValues.products.map(p => ({
            id: p.id,
            name: p.name,
            weight: p.weight
          }))
        : [{ id: crypto.randomUUID(), name: "", weight: 0.1 }]
    }), [initialValues]);

    const form = useForm<z.infer<typeof relationalInfoSchema>>({
      resolver: zodResolver(relationalInfoSchema),
      defaultValues
    });

    const [attachments, setAttachments] = React.useState(initialValues?.attachments || []);
    const [, setIsUploading] = React.useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setIsUploading(true);
        const { attachment, error } = await rncService.uploadAttachment(rncId, file);
        
        if (error) throw error;
        
        setAttachments(prev => [...prev, attachment]);
        toast.success("Arquivo anexado com sucesso!");
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Erro ao anexar arquivo");
      } finally {
        setIsUploading(false);
      }
    };

    const handleFileDownload = async (attachment: typeof attachments[0]) => {
      try {
        const url = await rncService.downloadAttachment(attachment);
        if (!url) throw new Error("Não foi possível gerar o link para download");
        
        const link = document.createElement('a');
        link.href = url;
        link.download = attachment.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading file:", error);
        toast.error("Erro ao baixar arquivo");
      }
    };

    const handleFileDelete = async (attachment: typeof attachments[0]) => {
      if (!confirm("Tem certeza que deseja excluir este arquivo?")) return;

      try {
        const { error } = await rncService.deleteAttachment(attachment);
        if (error) throw error;
        
        setAttachments(prev => prev.filter(a => a.id !== attachment.id));
        toast.success("Arquivo excluído com sucesso!");
      } catch (error) {
        console.error("Error deleting file:", error);
        toast.error("Erro ao excluir arquivo");
      }
    };

    React.useEffect(() => {
      if (initialValues) {
        form.reset(defaultValues);
      }
    }, [initialValues, form, defaultValues]);

    const { watch, setValue } = form;
    const products = watch("products");

    React.useEffect(() => {
      const currentData = localStorage.getItem('rncDetailsData');
      const parsedData = currentData ? JSON.parse(currentData) : {};
      localStorage.setItem('rncDetailsData', JSON.stringify({
        ...parsedData,
        relational: form.getValues()
      }));
    }, [form]);

    React.useImperativeHandle(ref, () => ({
      validate: () => {
        return form.trigger();
      },
    }));

    const addProduct = () => {
      const currentProducts = form.getValues("products");
      setValue("products", [
        ...currentProducts,
        { id: crypto.randomUUID(), name: "", weight: 0.1 }
      ]);
    };

    const removeProduct = (index: number) => {
      const currentProducts = form.getValues("products");
      if (currentProducts.length > 1) {
        setValue("products", currentProducts.filter((_, i) => i !== index));
      }
    };

    return (
      <div className="space-y-8 p-4">
        {/* Products Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Produtos</h3>
          <Form {...form}>
            <form className="space-y-4">
              {products?.map((product, index) => (
                <div key={product.id} className="flex gap-4 items-start">
                  <FormField
                    control={form.control}
                    name={`products.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Produto</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} placeholder="Digite o nome do produto" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`products.${index}.weight`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="number"
                            disabled={!isEditing}
                            placeholder="Digite o peso"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0.1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isEditing && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-8"
                      onClick={() => removeProduct(index)}
                      disabled={products.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {isEditing && (
                <Button type="button" variant="outline" onClick={addProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              )}
            </form>
          </Form>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contato</h3>
          <Form {...form}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </Form>
        </div>

        {/* Attachments Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Anexos</h3>
          {isEditing && (
            <FileUploadField
              label="Adicionar arquivo"
              onChange={handleFileUpload}
              accept="*/*"
            />
          )}

          <div className="space-y-2 mt-4">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-background/50 dark:bg-gray-800/50 rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <FileIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{attachment.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(attachment.filesize)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileDownload(attachment)}
                    className="text-blue-600 dark:text-blue-400"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileDelete(attachment)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

RelationalInfoTab.displayName = "RelationalInfoTab";