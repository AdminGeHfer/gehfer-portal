import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/ai";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { useChatLogic } from "@/hooks/useChatLogic";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useQuery } from "@tanstack/react-query";

export const ChatContainer = () => {
  const { conversationId } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const [model, setModel] = useState("");
  const [agentId, setAgentId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: messages = [], isLoading } = useQuery({
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
    gcTime: 1000 * 60 * 5,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  const { isLoading: isChatLoading, handleSubmit } = useChatLogic(conversationId!, model, agentId);
  const handleFileUpload = useFileUpload(handleSubmit);

  useEffect(() => {
    if (conversationId) {
      loadConversationDetails();
    }
  }, [conversationId]);

  const loadConversationDetails = async () => {
    if (!conversationId) return;
    
    try {
      const { data: conversation, error } = await supabase
        .from('ai_conversations')
        .select(`
          title, 
          agent_id,
          ai_agents (
            model_id
          )
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      if (conversation.agent_id) {
        setAgentId(conversation.agent_id);
        if (conversation.ai_agents?.model_id) {
          setModel(conversation.ai_agents.model_id);
        }
      }
    } catch {
      toast({
        title: "Erro ao carregar detalhes da conversa",
        description: "Não foi possível carregar as configurações do assistente",
        variant: "destructive",
      });
    }
  };

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

      toast({
        title: "Conversa excluída",
        description: "A conversa foi excluída com sucesso.",
      });

      navigate('/intelligence/chat');
    } catch (error) {
      toast({
        title: "Erro ao excluir conversa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('title')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title={conversation?.title || "Nova Conversa"}
        onDelete={handleDeleteConversation} 
        isDeleting={isDeleting}
        model={model}
        onModelChange={setModel}
        isLoading={isLoading}
      />
      
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-background/50 to-background/80 backdrop-blur-xl border-0 rounded-lg m-2">
        <div className="relative flex flex-col h-full">
          <MessageList 
            messages={messages} 
            agentId={agentId || ''} 
            conversationId={conversationId || ''}
          />
          <div className="sticky bottom-0 p-4 bg-background/80 backdrop-blur-md border-t">
            <ChatInput 
              onSubmit={handleSubmit} 
              onFileUpload={handleFileUpload}
              isLoading={isChatLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};