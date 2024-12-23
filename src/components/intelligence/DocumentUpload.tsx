import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUploadProps {
  agentId: string;
}

export const DocumentUpload = ({ agentId }: DocumentUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !agentId) return;

    setIsUploading(true);
    try {
      // Generate a unique filename
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
      const uniqueFilename = `${timestamp}-${file.name}`;
      
      // Upload file to storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('documents')
        .upload(`${agentId}/${uniqueFilename}`, file);

      if (storageError) throw storageError;

      // Create document record
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert({
          content: null,
          metadata: {
            filename: file.name,
            contentType: file.type,
            size: file.size,
            path: storageData.path,
            processor: 'docling',
            version: '1.0'
          }
        })
        .select()
        .single();

      if (documentError) throw documentError;

      // Associate document with agent
      const { error: assocError } = await supabase
        .from('ai_agent_documents')
        .insert({
          agent_id: agentId,
          document_id: documentData.id
        });

      if (assocError) throw assocError;

      // Process the document using Docling
      const { error: processError } = await supabase.functions.invoke('process-document', {
        body: JSON.stringify({
          documentId: documentData.id,
          filePath: storageData.path
        })
      });

      if (processError) throw processError;

      toast.success("Documento processado com sucesso");
      // Reset the input
      event.target.value = '';
    } catch (error: any) {
      console.error('Error processing document:', error);
      toast.error(error.message || "Erro ao processar documento");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        className="gap-2"
        disabled={isUploading || !agentId}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="h-4 w-4" />
        {isUploading ? "Processando..." : "Upload de Documento"}
      </Button>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
    </div>
  );
};