import { useParams } from "react-router-dom";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./chat/MessageList";
import { ChatHeader } from "./chat/ChatHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useChatMessages } from "./chat/hooks/useChatMessages";
import { useChatActions } from "./chat/hooks/useChatActions";

export const Chat = () => {
  const { conversationId } = useParams();
  const { messages } = useChatMessages(conversationId);
  const { handleSubmit, handleDeleteConversation, isDeleting, isLoading } = useChatActions(conversationId);

  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*, ai_agents(*)')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (!conversationId) return null;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title={conversation?.title || 'Nova Conversa'} 
        model={conversation?.ai_agents?.model_id || ''}
        onModelChange={() => {}}
        isDeleting={isDeleting}
        onDelete={handleDeleteConversation}
        isLoading={isLoading}
      />
      
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-xl">
        <MessageList 
          messages={messages} 
          agentId={conversation?.ai_agents?.id || ''} 
          conversationId={conversationId}
        />
      </div>

      <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-col gap-4 py-4">
          <ChatInput 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
};