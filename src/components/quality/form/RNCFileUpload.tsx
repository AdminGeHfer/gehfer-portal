import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";
import { Upload } from "lucide-react";

interface RNCFileUploadProps {
  form: UseFormReturn<RNCFormData>;
}

export const RNCFileUpload = ({ form }: RNCFileUploadProps) => {
  return (
    <FormField
      control={form.control}
      name="attachments"
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem>
          <FormLabel className="text-gray-300">Anexos</FormLabel>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center bg-[#1e2330]">
            <Input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                onChange(files);
              }}
              className="hidden"
              id="file-upload"
              {...field}
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-400">
                Clique ou arraste arquivos aqui
                <p className="text-xs mt-1">PDF, Word, Excel ou imagens até 10MB</p>
              </div>
            </label>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};