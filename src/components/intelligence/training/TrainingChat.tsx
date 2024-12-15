import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TrainingChatProps {
  agentId: string;
}

export const TrainingChat = ({ agentId }: TrainingChatProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: { message: content, agentId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, 
        { role: 'assistant', content: data.response }
      ]);
    },
    onError: () => {
      toast.error("Failed to send message");
    }
  });

  const handleSend = () => {
    if (!input.trim() || isPending) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <Card className={`max-w-[80%] p-4 ${
              message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  {message.content}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button 
            onClick={handleSend}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};