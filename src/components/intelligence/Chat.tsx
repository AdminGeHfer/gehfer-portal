import { useParams } from "react-router-dom";
import { ChatContainer } from "./chat/ChatContainer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { ModelSelector } from "./shared/ModelSelector";

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-gradient-to-br from-background to-background/90"
    >
      {conversationId && (
        <div className="h-14 border-b bg-card/50 backdrop-blur-sm flex items-center px-4 gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={agent?.icon} />
            <AvatarFallback className="bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {agent?.name || 'Assistente'}
            </span>
            <span className="text-xs text-muted-foreground">
              Online
            </span>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <ChatContainer />
      </div>
    </motion.div>
  );
};