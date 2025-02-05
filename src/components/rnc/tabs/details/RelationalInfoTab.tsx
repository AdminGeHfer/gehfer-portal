import * as React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/atoms/Button";
import { Plus, Trash2, FileIcon, Download } from "lucide-react";
import { handlePhoneChange, handleWeightChange } from "@/utils/masks";
import { rncService } from "@/services/rncService";
import { toast } from "sonner";
import { formatBytes } from "@/utils/format";
import { FileUploadField } from "@/components/rnc/FileUploadField";
import { RelationalInfoFormData } from "@/schemas/rncValidation";

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

export type RelationalInfoTabRef = {
  validate: () => Promise<boolean>;
  getFormData: () => RelationalInfoFormData;
};

export const RelationalInfoTab = React.forwardRef<RelationalInfoTabRef, RelationalInfoTabProps>(
  ({ rncId, isEditing, initialValues }, ref) => {
    const { control, setValue, getValues, trigger } = useFormContext<RelationalInfoFormData>();
    const values = getValues();
    
    // Initialize both states properly
    const [existingAttachments, setExistingAttachments] = React.useState<Array<{
      id: string;
      filename: string;
      filesize: number;
      content_type: string;
      file_path: string;
      created_by: string;
      created_at: string;
    }>>(initialValues?.attachments || []);
    const [newFiles, setNewFiles] = React.useState<File[]>([]);

    React.useImperativeHandle(ref, () => ({
      validate: async () => {
        const isValid = await trigger();
        return isValid;
      },
      getFormData: () => getValues()
    }));

    // Update form value whenever either attachments change
    React.useEffect(() => {
      setValue('attachments', [...existingAttachments, ...newFiles], {
        shouldValidate: true,
        shouldDirty: true
      });
    }, [existingAttachments, newFiles, setValue]);

    // Update existing attachments when initialValues changes
    React.useEffect(() => {
      if (initialValues?.attachments) {
        setExistingAttachments(initialValues.attachments);
      }
    }, [initialValues?.attachments]);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files?.length) return;

      try {
        const files = Array.from(event.target.files);
        setNewFiles(prev => [...prev, ...files]);
        toast.success("Arquivo anexado com sucesso!");
      } catch (error) {
        console.error("Error handling file:", error);
        toast.error("Erro ao anexar arquivo");
      } finally {
        event.target.value = '';
      }
    };

    const handleFileDownload = async (attachment: typeof existingAttachments[0]) => {
      try {
        const url = rncService.getAttachmentUrl(attachment.file_path);
        window.open(url, '_blank');
        toast.success("Download iniciado com sucesso!");
      } catch (error) {
        console.error("Error downloading file:", error);
        toast.error("Erro ao baixar arquivo");
      }
    };

    const handleFileDelete = async (attachment: typeof existingAttachments[0]) => {
      if (!confirm("Tem certeza que deseja excluir este arquivo?")) return;

      try {
        await rncService.deleteAttachment(rncId, attachment.id);
        const updatedAttachments = existingAttachments.filter(a => a.id !== attachment.id);
        setExistingAttachments(updatedAttachments);
        toast.success("Arquivo excluído com sucesso!");
      } catch (error) {
        console.error("Error deleting file:", error);
        toast.error("Erro ao excluir arquivo");
      }
    };

    const addProduct = () => {
      const currentProducts = values.products || [];
      setValue("products", [
        ...currentProducts,
        { id: crypto.randomUUID(), name: "", weight: 0.1 }
      ], { shouldValidate: true });
    };

    const removeProduct = (index: number) => {
      const currentProducts = values.products || [];
      if (currentProducts.length > 1) {
        setValue(
          "products",
          currentProducts.filter((_, i) => i !== index),
          { shouldValidate: true }
        );
      }
    };

    return (
      <div className="space-y-8 p-4">
        {/* Products Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Produtos</h3>
          <div className="space-y-4">
            {values.products?.map((product, index) => (
              <div key={product.id} className="flex gap-4 items-start">
                <FormField
                  control={control}
                  name={`products.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Produto</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          value={field.value || ''}
                          disabled={!isEditing}
                          placeholder="Digite o nome do produto" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`products.${index}.weight`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Peso (kg)</FormLabel>
                      <FormControl>
                      <Input 
                        {...field}
                        type="text"
                        inputMode="numeric"
                        step="1.0"
                        min="0.1"
                        onChange={(e) => handleWeightChange(e, field.onChange)}
                        placeholder="Digite o peso"
                        className="border-blue-200 focus:border-blue-400"
                        value={field.value ? field.value.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }) : ''}
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
                    disabled={values.products?.length === 1}
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
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`contacts.0.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Nome
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      disabled={!isEditing}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`contacts.0.phone`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Telefone
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
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
              control={control}
              name={`contacts.0.email`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      value={field.value || ''}
                      disabled={!isEditing}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Attachments Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Anexos</h3>
          {isEditing && (
            <FileUploadField
              label="Adicionar arquivo"
              onChange={handleFileSelect}
              accept="*/*"
              loading={false}
            />
          )}

          <div className="space-y-2 mt-4">
            {/* Show existing attachments */}
            {existingAttachments.map((attachment) => (
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

            {/* Show new files */}
            {newFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-background/50 dark:bg-gray-800/50 rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <FileIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNewFiles(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

RelationalInfoTab.displayName = "RelationalInfoTab";
