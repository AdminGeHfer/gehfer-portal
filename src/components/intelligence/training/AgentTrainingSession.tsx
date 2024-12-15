import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { AIAgent } from "@/types/ai/agent";

interface AgentTrainingSessionProps {
  agentId: string;
  onBack: () => void;
}

export const AgentTrainingSession = ({ agentId, onBack }: AgentTrainingSessionProps) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  const { data: agent, isLoading } = useQuery({
    queryKey: ['agent', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (error) throw error;
      return data as AIAgent;
    }
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: { message: input, agentId }
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      setInput("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!agent) {
    return <div>Agent not found</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <Card className={`max-w-[80%] p-4 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>{message.content}</div>
              </div>
            </Card>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded p-2"
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  );
};