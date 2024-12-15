import { useParams } from "react-router-dom";
import { ChatContainer } from "./chat/ChatContainer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bot } from "lucide-react";

export const Chat = () => {
  const { conversationId } = useParams();

  const { data: agent } = useQuery({
    queryKey: ['agent', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      
      const { data: conversation } = await supabase
        .from('ai_conversations')
        .select('agent_id, ai_agents(name, icon, color)')
        .eq('id', conversationId)
        .single();

      return conversation?.ai_agents;
    },
    enabled: !!conversationId
  });

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background to-background/90">
      {conversationId && (
        <div className="h-14 border-b bg-card/50 backdrop-blur-sm flex items-center px-4 gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {agent?.icon ? (
              <img src={agent.icon} alt={agent?.name} className="w-5 h-5" />
            ) : (
              <Bot className="w-5 h-5 text-primary" />
            )}
          </div>
          <span className="font-medium">{agent?.name || 'Assistente'}</span>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <ChatContainer />
      </div>
    </div>
  );
};