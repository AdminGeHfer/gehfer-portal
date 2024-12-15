import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/types/ai";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TrainingChatProps {
  agentId: string;
}

export const TrainingChat = ({ agentId }: TrainingChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      console.log('Sending message:', message);
      const response = await supabase.functions.invoke('chat-completion', {
        body: { message, agentId }
      });
      
      if (response.error) {
        console.error('Error from chat-completion:', response.error);
        throw new Error(response.error.message);
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      if (!data.response) {
        throw new Error('Invalid response format from server');
      }

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        conversation_id: '',
        created_at: new Date().toISOString()
      }]);
      setInput("");
    },
    onError: (error) => {
      console.error('Error in chat:', error);
      toast.error("Failed to send message: " + error.message);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-4' 
                  : 'bg-muted mr-4'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={sendMessage.isPending}
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