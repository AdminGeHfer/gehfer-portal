import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { SplitSquareHorizontal, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface DocumentChunksProps {
  documentId: string;
  versionId?: string;
}

export function DocumentChunks({ documentId, versionId }: DocumentChunksProps) {
  const { data: chunks, isLoading } = useQuery({
    queryKey: ['document-chunks', documentId, versionId],
    queryFn: async () => {
      let query = supabase
        .from('document_chunks')
        .select('*')
        .eq('document_id', documentId)
        .order('metadata->position');

      if (versionId) {
        query = query.eq('version_id', versionId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="text-center p-4">Carregando chunks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <SplitSquareHorizontal className="h-5 w-5" />
        <h3 className="text-lg font-medium">Chunks Semânticos</h3>
      </div>

      {chunks?.map((chunk, index) => (
        <Card key={chunk.id} className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Chunk {index + 1}</span>
                <Badge variant="outline">
                  Coerência: {(chunk.coherence_score * 100).toFixed(1)}%
                </Badge>
              </div>
              <p className="text-sm whitespace-pre-wrap">{chunk.content}</p>
              {chunk.topic && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Brain className="h-4 w-4" />
                  <span>Tópico: {chunk.topic}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}