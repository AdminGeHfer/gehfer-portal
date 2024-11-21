import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RNCFormData } from "@/types/rnc";

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
          <FormLabel>Anexos</FormLabel>
          <Input
            type="file"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              onChange(files);
            }}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            {...field}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};