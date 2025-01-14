import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useFileUpload = (onSubmit: (content: string) => Promise<void>) => {
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    try {
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
        description: error.message || "Ocorreu um erro ao enviar o arquivo.",
        variant: "destructive",
      });
    }
  };

  return handleFileUpload;
};