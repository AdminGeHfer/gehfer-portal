import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/ai";
import { truncateMessages } from "@/utils/chatUtils";

export const useChatLogic = (conversationId: string, model: string, agentId: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

      // Get all previous messages for context
      const { data: messages } = await supabase
        .from('ai_messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      // Get truncated messages for the API call
      const truncatedMessages = truncateMessages(
        [...(messages || []), { role: userMessage.role, content: userMessage.content }],
        model
      );

      const response = await supabase.functions.invoke('chat-completion', {
        body: { 
          messages: truncatedMessages,
          model,
          agentId // Pass the agent ID to use its configuration
        },
      });

      if (response.error) {
        if (response.error.message?.includes('Limite de tokens excedido') ||
            response.error.message?.includes('conversa ficou muito longa')) {
          toast({
            title: "Limite de mensagens atingido",
            description: "A conversa ficou muito longa. Por favor, crie uma nova conversa ou use um modelo diferente.",
            variant: "destructive",
          });
          return;
        }
        throw response.error;
      }

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
        description: error.message || "Ocorreu um erro ao processar sua mensagem",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit
  };
};