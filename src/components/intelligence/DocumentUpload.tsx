import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DoclingProcessor } from "@/lib/docling/services/DoclingProcessor";
import { Progress } from "@/components/ui/progress";

interface DocumentUploadProps {
  agentId: string;
}

export const DocumentUpload = ({ agentId }: DocumentUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [processor, setProcessor] = useState<DoclingProcessor | null>(null);

  useEffect(() => {
    const initializeProcessor = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          toast.error('Please login to access this feature');
          return;
        }

        const newProcessor = new DoclingProcessor();
        await newProcessor.initialize();
        setProcessor(newProcessor);
        setIsInitialized(true);
      } catch (error: any) {
        console.error('Error initializing processor:', error);
        toast.error(error.message || "Failed to initialize document processing");
      }
    };

    initializeProcessor();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !agentId || !processor) return;

    setIsUploading(true);
    setProgress(0);
    
    try {
      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, "");
      const uniqueFilename = `${timestamp}-${file.name}`;
      
      // Upload file to storage
      setProgress(20);
      const { data: storageData, error: storageError } = await supabase.storage
        .from('documents')
        .upload(`${agentId}/${uniqueFilename}`, file);

      if (storageError) throw storageError;
      
      setProgress(40);

      // Process document
      const { chunks, metrics } = await processor.processDocument(file);
      setProgress(70);

      // Create document record
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert({
          metadata: {
            filename: file.name,
            contentType: file.type,
            size: file.size,
            path: storageData.path,
            processor: 'docling',
            version: '2.0',
            metrics: JSON.stringify(metrics)
          },
          processed: true
        })
        .select()
        .single();

      if (documentError) throw documentError;
      
      setProgress(85);

      // Associate document with agent
      const { error: assocError } = await supabase
        .from('ai_agent_documents')
        .insert({
          agent_id: agentId,
          document_id: documentData.id
        });

      if (assocError) throw assocError;

      setProgress(100);
      toast.success("Documento processado com sucesso");
      
      // Reset the input
      event.target.value = '';
    } catch (error: any) {
      console.error('Error processing document:', error);
      toast.error(error.message || "Erro ao processar documento");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="gap-2"
          disabled={isUploading || !agentId || !isInitialized}
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
      
      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Processando documento... {progress}%
          </p>
        </div>
      )}
    </div>
  );
};