import { useState, useEffect } from "react";
import { Message } from "@/types/ai";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useChatMessages = (conversationId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) return;
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        toast.error("Erro ao carregar mensagens");
        return;
      }

      if (data) {
        console.log('Loaded messages:', data);
        setMessages(data);
      }
      setIsLoading(false);
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
          console.log('New message received:', payload.new);
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return {
    messages,
    setMessages,
    isLoading,
    setIsLoading
  };
};