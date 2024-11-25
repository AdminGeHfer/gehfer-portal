import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RNCFileUploadProps {
  form: UseFormReturn<RNCFormData>;
  rncId?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png'
];

export const RNCFileUpload = ({ form, rncId }: RNCFileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`O arquivo ${file.name} excede o limite de 10MB`);
      return false;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error(`O tipo de arquivo ${file.type} não é permitido`);
      return false;
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(validateFile);
    
    if (!validFiles.length) return;

    if (rncId) {
      await uploadFiles(validFiles);
    } else {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      form.setValue("attachments", [...(form.getValues("attachments") || []), ...validFiles]);
    }
  };

  const uploadFiles = async (files: File[]) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error("Usuário não autenticado");
      return;
    }

    setIsUploading(true);
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${rncId}/${fileName}`;

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('rnc-attachments')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Create attachment record
        const { error: dbError } = await supabase
          .from('rnc_attachments')
          .insert({
            rnc_id: rncId,
            filename: file.name,
            filesize: file.size,
            content_type: file.type,
            created_by: userData.user.id
          });

        if (dbError) throw dbError;
      }

      toast.success("Arquivos anexados com sucesso!");
      setSelectedFiles([]);
      e.target.value = ''; // Reset input
    } catch (error: any) {
      console.error("Error uploading files:", error);
      toast.error(`Erro ao fazer upload dos arquivos: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    form.setValue("attachments", newFiles);
  };

  return (
    <FormField
      control={form.control}
      name="attachments"
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem>
          <FormLabel>Anexos</FormLabel>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/50">
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              accept={ALLOWED_FILE_TYPES.join(',')}
              disabled={isUploading}
              {...field}
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                {isUploading ? "Enviando arquivos..." : "Clique ou arraste arquivos aqui"}
                <p className="text-xs mt-1">PDF, Word, Excel ou imagens até 10MB</p>
              </div>
            </label>
          </div>

          {selectedFiles.length > 0 && !rncId && (
            <div className="mt-4 space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span className="text-sm truncate">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};