import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TrainingChatProps {
  agentId: string;
}

export const TrainingChat = ({ agentId }: TrainingChatProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      // TODO: Implement chat logic
      toast({
        title: "Mensagem enviada",
        description: "Aguardando resposta do agente...",
      });
      setMessage("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TODO: Implement message list */}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="min-h-[80px]"
          />
          <Button type="submit" className="px-8">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};