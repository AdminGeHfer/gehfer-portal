import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/ai";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { useChatLogic } from "@/hooks/useChatLogic";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const ChatContainer = () => {
  const { conversationId } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [model, setModel] = useState("gpt-4o-mini");
  const [agentId, setAgentId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('title, agent_id, ai_agents(name, icon, color)')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!conversationId
  });

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!conversationId
  });

  useEffect(() => {
    if (conversation?.agent_id) {
      setAgentId(conversation.agent_id);
    }
  }, [conversation]);

  useEffect(() => {
    if (!conversationId) return;

    const subscription = supabase
      .channel('ai_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          queryClient.setQueryData(['messages', conversationId], (old: Message[] = []) => 
            [...old, payload.new as Message]
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, queryClient]);

  const { isLoading: isSending, handleSubmit } = useChatLogic(conversationId!, model, agentId);
  const handleFileUpload = useFileUpload(handleSubmit);

  const handleDeleteConversation = async () => {
    if (!conversationId || isDeleting) return;

    setIsDeleting(true);
    try {
      const { error: deleteMessagesError } = await supabase
        .from('ai_messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (deleteMessagesError) throw deleteMessagesError;

      const { error: deleteConversationError } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId);

      if (deleteConversationError) throw deleteConversationError;

      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });

      toast({
        title: "Conversa excluída",
        description: "A conversa foi excluída com sucesso.",
      });

      navigate('/intelligence/chat');
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Erro ao excluir conversa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!conversationId) {
    return null;
  }

  const isLoading = isLoadingConversation || isLoadingMessages || isSending;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        onDelete={handleDeleteConversation} 
        isDeleting={isDeleting}
        model={model}
        onModelChange={setModel}
        isLoading={isLoading}
      />
      
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-xl border-0 rounded-lg m-2">
        <div className="relative flex flex-col h-full">
          <MessageList messages={messages} />
          <div className="sticky bottom-0 p-4 bg-background/80 backdrop-blur-md border-t">
            <ChatInput 
              onSubmit={handleSubmit} 
              onFileUpload={handleFileUpload}
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};