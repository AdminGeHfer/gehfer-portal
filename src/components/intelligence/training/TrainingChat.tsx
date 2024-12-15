import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/types/ai";
import { supabase } from "@/integrations/supabase/client";

interface TrainingChatProps {
  agentId: string;
}

export const TrainingChat = ({ agentId }: TrainingChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const response = await supabase.functions.invoke('chat-completion', {
        body: { message, agentId }
      });
      return response.data;
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        conversation_id: '',
        created_at: new Date().toISOString()
      }]);
      setInput("");
    }
  });

  const handleSend = () => {
    if (!input.trim() || sendMessage.isPending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      conversation_id: '',
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessage.mutate(input);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4">
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            onClick={handleSend}
            disabled={sendMessage.isPending}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};