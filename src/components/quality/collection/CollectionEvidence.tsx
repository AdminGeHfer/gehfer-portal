import { Button } from "@/components/ui/button";
import { FileIcon, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CollectionEvidenceProps {
  evidence: any[];
}

export function CollectionEvidence({ evidence }: CollectionEvidenceProps) {
  const downloadEvidence = async (evidence: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('collection-evidence')
        .download(evidence.file_path);

      if (error) throw error;

      const blob = new Blob([data], { type: evidence.content_type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = evidence.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading evidence:", error);
      toast.error("Erro ao baixar arquivo");
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };

  if (!evidence || evidence.length === 0) {
    return (
      <div>
        <h4 className="font-medium mb-2">Evidências</h4>
        <p className="text-sm text-muted-foreground">Nenhuma evidência encontrada</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium mb-2">Evidências</h4>
      <div className="grid gap-2">
        {evidence.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 bg-muted rounded-lg"
          >
            <div className="flex items-center gap-2">
              {getFileIcon(item.filename)}
              <span className="text-sm">{item.filename}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadEvidence(item)}
            >
              Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}