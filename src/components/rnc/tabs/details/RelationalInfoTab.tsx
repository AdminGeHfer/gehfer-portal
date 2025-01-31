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
import { FileUploadField } from "@/components/rnc/FileUploadField";
import { CreateRNCContact, CreateRNCProduct, RNCAttachment } from "@/types/rnc";
import { relationalInfoSchema } from "@/utils/validations";

interface RelationalInfoTabProps {
  rncId: string;
  isEditing: boolean;
  initialValues?: {
    contacts?: Array<{
    name?: string;
    phone?: string;
    email?: string;
    }>;
    products?: Array<{
      id: string;
      name: string;
      weight: number;
    }>;
    attachments?: Array<{
      id: string;
      filename: string;
      filesize: number;
      content_type: string;
      file_path: string;
      created_by: string;
      created_at: string;
    }>;
  };
}

export type RelationalInfoFormData = {
  contacts: CreateRNCContact[];
  products: CreateRNCProduct[];
  attachments?: (File | RNCAttachment)[];
};

export type RelationalInfoTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => RelationalInfoFormData;
};

export const RelationalInfoTab = React.forwardRef<RelationalInfoTabRef, RelationalInfoTabProps>(
  ({ rncId, isEditing, initialValues }, ref) => {
    const defaultValues = React.useMemo(() => ({
      contacts: initialValues?.contacts?.length ? initialValues.contacts : [{
        name: "",
        phone: "",
        email: ""
      }],
      products: initialValues?.products?.length ? initialValues.products : [{
        id: crypto.randomUUID(),
        name: "",
        weight: 0.1
      }],
      attachments: initialValues?.attachments || []
    }), [initialValues]);

    const form = useForm<z.infer<typeof relationalInfoSchema>>({
      resolver: zodResolver(relationalInfoSchema),
      defaultValues
    });

    const [attachments, setAttachments] = React.useState(initialValues?.attachments || []);
    const [isUploading, setIsUploading] = React.useState(false);

    const handleFileSelect = async (file: File) => {
      if (!file) return;

      try {
        setIsUploading(true);
        const attachment = await rncService.uploadAttachment(rncId, file);
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
        const url = rncService.getAttachmentUrl(attachment.file_path);
        window.open(url, '_blank');
        toast.success("Download iniciado com sucesso!");
      } catch (error) {
        console.error("Error downloading file:", error);
        toast.error("Erro ao baixar arquivo");
      }
    };

    const handleFileDelete = async (attachment: typeof attachments[0]) => {
      if (!confirm("Tem certeza que deseja excluir este arquivo?")) return;

      try {
        await rncService.deleteAttachment(rncId, attachment.id);
        setAttachments(prev => prev.filter(a => a.id !== attachment.id));
        toast.success("Arquivo excluído com sucesso!");
      } catch (error) {
        console.error("Error deleting file:", error);
        toast.error("Erro ao excluir arquivo");
      }
    };

    const { watch, setValue } = form;
    const products = watch("products");

    React.useImperativeHandle(ref, () => ({
      validate: () => form.trigger(),
      getFormData: () => ({
        contacts: form.getValues("contacts"),
        products: form.getValues("products"),
        attachments
      })
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
              onFileSelect={handleFileSelect}
              accept="*/*"
              loading={isUploading}
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