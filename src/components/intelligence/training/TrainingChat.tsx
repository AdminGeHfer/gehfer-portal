import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, MessageSquare, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TrainingChatProps {
  agentId: string;
}

export const TrainingChat = ({ agentId }: TrainingChatProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const queryClient = useQueryClient();

  const { mutate: sendMessage, isLoading } = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ['agent-training-sessions'] });
    },
    onError: () => {
      toast.error("Failed to send message");
    }
  });

  const { mutate: evaluateResponse } = useMutation({
    mutationFn: async ({ messageId, rating, feedback }: { messageId: string, rating: number, feedback?: string }) => {
      const { error } = await supabase
        .from('agent_training_evaluations')
        .insert({
          message_id: messageId,
          rating,
          feedback,
          session_id: agentId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Evaluation submitted");
      queryClient.invalidateQueries({ queryKey: ['agent-training-sessions'] });
    },
    onError: () => {
      toast.error("Failed to submit evaluation");
    }
  });

  const handleSend = () => {
    if (!input.trim()) return;
    
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
                  {message.role === 'assistant' && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => evaluateResponse({ 
                          messageId: index.toString(),
                          rating: 1
                        })}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => evaluateResponse({ 
                          messageId: index.toString(),
                          rating: 0
                        })}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
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
            disabled={isLoading}
          >
            {isLoading ? (
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