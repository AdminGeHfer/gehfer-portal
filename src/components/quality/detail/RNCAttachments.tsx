import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileIcon, Download, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface RNCAttachment {
  id: string;
  filename: string;
  content_type: string;
  filesize: number;
  file_path: string;
}

interface RNCAttachmentsProps {
  rncId: string;
  canEdit?: boolean;
  onUploadComplete?: () => void;
}

export function RNCAttachments({ rncId, canEdit = false }: RNCAttachmentsProps) {
  const queryClient = useQueryClient();
  
  const { data: attachments, isLoading } = useQuery({
    queryKey: ["rnc-attachments", rncId],
    queryFn: async () => {
      console.log('Fetching attachments for RNC');
      const { data, error } = await supabase
        .from('rnc_attachments')
        .select('*')
        .eq('rnc_id', rncId);

      if (error) {
        console.error("Error fetching attachments:", error);
        throw error;
      }
      
      console.log('Fetched attachments');
      return data as RNCAttachment[];
    }
  });

  const downloadAttachment = async (attachment: RNCAttachment) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Usuário não autenticado");
        return;
      }

      // Use the stored file_path from the database
      const { data, error } = await supabase.storage
        .from('rnc-attachments')
        .download(attachment.file_path);

      if (error) {
        console.error("Error downloading file:", error);
        throw error;
      }

      // Create and trigger download
      const blob = new Blob([data], { type: attachment.content_type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Download iniciado com sucesso");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error(`Erro ao baixar arquivo: ${error.message}`);
    }
  };

  const deleteAttachment = async (attachment: RNCAttachment) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Usuário não autenticado");
        return;
      }

      // Delete from storage using the stored file_path
      const { error: storageError } = await supabase.storage
        .from('rnc-attachments')
        .remove([attachment.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('rnc_attachments')
        .delete()
        .eq('id', attachment.id);

      if (dbError) throw dbError;

      toast.success("Arquivo excluído com sucesso");
      queryClient.invalidateQueries({ queryKey: ["rnc-attachments", rncId] });
    } catch (error) {
      console.error("Error deleting attachment:", error);
      toast.error(`Erro ao excluir arquivo: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div className="p-4">Carregando anexos...</div>;
  }

  if (!attachments || attachments.length === 0) {
    return <div className="text-muted-foreground p-4">Nenhum anexo encontrado</div>;
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <FileIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{attachment.filename}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => downloadAttachment(attachment)}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-muted rounded-full"
              title="Baixar arquivo"
            >
              <Download className="h-4 w-4" />
            </Button>
            {canEdit && (
              <Button
                onClick={() => deleteAttachment(attachment)}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-muted rounded-full text-destructive hover:text-destructive"
                title="Excluir arquivo"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
