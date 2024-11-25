import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";
import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RNCFileUploadProps {
  form: UseFormReturn<RNCFormData>;
  rncId?: string;
}

export const RNCFileUpload = ({ form, rncId }: RNCFileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    console.log('Files selected:', files.map(f => ({ name: f.name, size: f.size })));
    
    if (files.some(file => file.size > 10 * 1024 * 1024)) {
      toast.error("Um ou mais arquivos excedem o limite de 10MB.");
      return;
    }

    if (rncId) {
      setIsUploading(true);
      console.log('Starting upload process for RNC:', rncId);
      
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          console.error('No authenticated user found');
          toast.error("Usuário não autenticado");
          return;
        }

        console.log('Authenticated user:', userData.user.id);
        const uploadedFiles = [];
        
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          const filePath = `${rncId}/${fileName}`;

          console.log('Preparing to upload file:', {
            originalName: file.name,
            newName: fileName,
            path: filePath,
            size: file.size,
            type: file.type
          });

          const { error: uploadError } = await supabase.storage
            .from('rnc-attachments')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error("Upload error:", uploadError);
            throw uploadError;
          }

          console.log('File uploaded successfully to storage');

          const { error: dbError } = await supabase
            .from('rnc_attachments')
            .insert({
              rnc_id: rncId,
              filename: file.name,
              filesize: file.size,
              content_type: file.type,
              created_by: userData.user.id,
              file_path: filePath
            });

          if (dbError) {
            console.error("Database error:", dbError);
            throw dbError;
          }

          console.log('File record created in database');
          
          uploadedFiles.push({
            filename: file.name,
            filesize: file.size,
            content_type: file.type
          });
        }

        console.log('All files uploaded successfully:', uploadedFiles);
        toast.success("Arquivos anexados com sucesso!");
        setSelectedFiles([]);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error: any) {
        console.error("Error uploading files:", error);
        toast.error(`Erro ao fazer upload dos arquivos: ${error.message}`);
      } finally {
        setIsUploading(false);
      }
    } else {
      console.log('No rncId available, updating form state only');
      setSelectedFiles(prev => [...prev, ...files]);
      form.setValue("attachments", [...(form.getValues("attachments") || []), ...files]);
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
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
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