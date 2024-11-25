import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";
import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
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

    setSelectedFiles(prev => [...prev, ...files]);
    const currentAttachments = form.getValues("attachments") || [];
    form.setValue("attachments", [...currentAttachments, ...files]);
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

          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span className="text-sm truncate">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
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