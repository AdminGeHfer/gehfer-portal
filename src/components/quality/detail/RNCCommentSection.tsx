import { useState } from "react";
import * as React from "react";
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
    if (!comment.trim()) {
      toast.error("O comentário não pode estar vazio");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("rnc_events").insert({
        rnc_id: rncId,
        title: "Novo comentário",
        description: comment.trim(), // Using description field instead of comment
        type: "comment",
        created_by: (await supabase.auth.getUser()).data.user?.id as string,
      });

      if (error) throw error;

      toast.success("Comentário adicionado com sucesso");
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
        placeholder="Adicione um comentário..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Enviando..." : "Enviar Comentário"}
      </Button>
    </div>
  );
}