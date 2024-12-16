import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Message } from "@/types/ai";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./chat/MessageList";
import { ChatHeader } from "./chat/ChatHeader";
import { AgentMetricsDashboard } from "./metrics/AgentMetricsDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Chat = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) return;

      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages(data || []);
    };

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`conversation_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const handleSubmit = async (content: string) => {
    if (!conversationId || !content.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('ai_messages')
        .insert({
          conversation_id: conversationId,
          content,
          role: 'user',
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!conversationId) return null;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader title={conversation?.title || 'Nova Conversa'} />
      
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages} 
          agentId={conversation?.ai_agents?.id || ''} 
          conversationId={conversationId}
        />
      </div>

      <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-col gap-4 py-4">
          <AgentMetricsDashboard agentId={conversation?.ai_agents?.id || ''} />
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};