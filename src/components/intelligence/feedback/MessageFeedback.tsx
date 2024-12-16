import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MessageFeedbackProps {
  messageId: string;
  agentId: string;
  conversationId: string;
}

export const MessageFeedback = ({ messageId, agentId, conversationId }: MessageFeedbackProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('agent_feedback')
        .insert({
          message_id: messageId,
          agent_id: agentId,
          conversation_id: conversationId,
          rating,
          feedback_text: feedback || null,
          feedback_type: rating > 3 ? 'positive' : 'negative'
        });

      if (error) throw error;

      toast.success("Feedback enviado com sucesso!");
      setIsOpen(false);
      setFeedback("");
      setRating(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error("Erro ao enviar feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative group">
      {!isOpen ? (
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      ) : (
        <div className="flex flex-col gap-2 p-2 rounded-lg border bg-background shadow-lg">
          <div className="flex gap-2 justify-center">
            <Button
              variant={rating === 1 ? "default" : "ghost"}
              size="sm"
              onClick={() => setRating(1)}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
            <Button
              variant={rating === 5 ? "default" : "ghost"}
              size="sm"
              onClick={() => setRating(5)}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </div>
          
          {rating && (
            <>
              <Textarea
                placeholder="Comentários adicionais (opcional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[80px] text-sm"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  Enviar
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};