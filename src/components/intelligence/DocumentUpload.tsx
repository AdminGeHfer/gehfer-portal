import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUploadProps {
  moduleId?: string;
}

export const DocumentUpload = ({ moduleId }: DocumentUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);

      // Create FormData instance
      const formData = new FormData();
      formData.append('file', file);
      if (moduleId) {
        formData.append('moduleId', moduleId);
      }

      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: formData,
      });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      toast.success('Document processed successfully!');
      
    } catch (error: any) {
      console.error('Error processing document:', error);
      toast.error('Error processing document: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.txt"
          disabled={isLoading}
          className="hidden"
          id="document-upload"
        />
        <label
          htmlFor="document-upload"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload Document
        </label>
      </div>
    </div>
  );
};