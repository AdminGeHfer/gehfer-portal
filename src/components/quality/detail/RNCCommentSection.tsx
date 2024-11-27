import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RNCCommentSectionProps {
  rncId: string;
  onCommentAdded: () => void;
}

export function RNCCommentSection({ rncId, onCommentAdded }: RNCCommentSectionProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    
    try {
      setIsSubmitting(true);
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("rnc_events")
        .insert({
          rnc_id: rncId,
          title: "Novo comentário",
          description: "Um comentário foi adicionado",
          type: "comment",
          created_by: userData.user?.id,
          comment: comment.trim()
        });

      if (error) throw error;
      
      toast.success("Comentário adicionado com sucesso!");
      setComment("");
      onCommentAdded();
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Erro ao adicionar comentário");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Digite seu comentário..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting || !comment.trim()}
      >
        {isSubmitting ? "Enviando..." : "Adicionar Comentário"}
      </Button>
    </div>
  );
}