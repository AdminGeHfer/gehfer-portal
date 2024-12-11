import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/ai";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Chat = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      const subscription = subscribeToMessages();
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [conversationId]);

  const loadMessages = async () => {
    if (!conversationId) return;
    
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data as Message[]);
      
    } catch (error: any) {
      console.error('Error loading messages:', error);
      toast({
        title: "Erro ao carregar mensagens",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const subscribeToMessages = () => {
    if (!conversationId) return;

    return supabase
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
  };

  const handleSubmit = async (content: string) => {
    if (!conversationId || isLoading || !content.trim()) return;

    setIsLoading(true);

    try {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      };

      const { error: saveError } = await supabase
        .from('ai_messages')
        .insert(userMessage);

      if (saveError) throw saveError;

      const response = await supabase.functions.invoke('chat-completion', {
        body: { messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })) },
      });

      if (response.error) throw response.error;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role: 'assistant',
        content: response.data.choices[0].message.content,
        created_at: new Date().toISOString(),
      };

      const { error: saveAiError } = await supabase
        .from('ai_messages')
        .insert(assistantMessage);

      if (saveAiError) throw saveAiError;

    } catch (error: any) {
      console.error('Error in chat flow:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!conversationId) {
    return null;
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/intelligence/chat')}
          className="hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-semibold tracking-tight">Chat</h2>
      </div>
      
      <Card className="flex flex-col flex-1 backdrop-blur-sm bg-card/30">
        <MessageList messages={messages} />
        <div className="p-4 border-t bg-background/50">
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </Card>
    </div>
  );
};