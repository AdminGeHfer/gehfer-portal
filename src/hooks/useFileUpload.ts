import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateFileSecurity } from "@/utils/fileSecurity";

export const useFileUpload = (onSubmit: (content: string) => Promise<void>) => {
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    try {
      const validation = validateFileSecurity(file, {
        maxSizeBytes: 10 * 1024 * 1024,
        allowedMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "application/pdf",
          "text/plain",
        ],
        allowedExtensions: ["jpg", "jpeg", "png", "webp", "pdf", "txt"],
      });
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error("Não foi possível obter a URL pública do arquivo.");
      }

      const content = `[Arquivo anexado: ${file.name}](${publicUrl})`;
      await onSubmit(content);

      toast({
        title: "Arquivo enviado",
        description: "O arquivo foi enviado com sucesso."
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro ao enviar arquivo",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao enviar o arquivo.",
        variant: "destructive",
      });
    }
  };

  return handleFileUpload;
};
