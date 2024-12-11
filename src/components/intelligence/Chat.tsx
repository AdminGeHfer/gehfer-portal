import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/ai";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";

export const Chat = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      subscribeToMessages();
    }
  }, [conversationId]);

  const loadMessages = async () => {
    if (!conversationId) return;
    
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error loading messages",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setMessages(data as Message[]);
  };

  const subscribeToMessages = () => {
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
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSubmit = async (content: string) => {
    if (!conversationId || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    try {
      // Save user message
      const { error: saveError } = await supabase
        .from('ai_messages')
        .insert(userMessage);

      if (saveError) throw saveError;

      // Get AI response
      const response = await supabase.functions.invoke('chat-completion', {
        body: { messages: [...messages, userMessage] },
      });

      if (response.error) throw response.error;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role: 'assistant',
        content: response.data.choices[0].message.content,
        created_at: new Date().toISOString(),
      };

      // Save AI response
      const { error: saveAiError } = await supabase
        .from('ai_messages')
        .insert(assistantMessage);

      if (saveAiError) throw saveAiError;

    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] backdrop-blur-sm bg-background/30">
      <MessageList messages={messages} />
      <div className="p-4 border-t">
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </Card>
  );
};