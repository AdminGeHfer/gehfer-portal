import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/ai";
import { truncateMessages } from "@/utils/chatUtils";
import { useMemory } from "@/hooks/useMemory";

export const useChatLogic = (conversationId: string, model: string, agentId: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { initializeMemory } = useMemory(conversationId);

  const handleSubmit = async (content: string) => {
    if (!conversationId || !content.trim()) {
      if (!content.trim()) {
        toast({
          title: "Mensagem vazia",
          description: "Por favor, digite uma mensagem antes de enviar.",
          variant: "destructive",
        });
      }
      return;
    }

    // Create user message object
    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    // Set loading state immediately
    setIsLoading(true);

    try {
      // Save user message immediately and don't wait for the response
      const saveMessagePromise = supabase
        .from('ai_messages')
        .insert(userMessage);

      // Start memory initialization and message fetching in parallel
      const [memory, { data: messages, error: messagesError }] = await Promise.all([
        initializeMemory(),
        supabase
          .from('ai_messages')
          .select('role, content')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true }),
        saveMessagePromise // Include this to ensure it completes
      ]);

      if (messagesError) throw messagesError;

      console.log('Sending request to chat-completion with:', {
        messages: truncateMessages(
          [...(messages || []), { role: userMessage.role, content: userMessage.content }],
          model
        ),
        model,
        agentId,
        memory
      });

      const response = await supabase.functions.invoke('chat-completion', {
        body: {
          messages: truncateMessages(
            [...(messages || []), { role: userMessage.role, content: userMessage.content }],
            model
          ),
          model,
          agentId,
          memory
        },
      });

      if (response.error) {
        handleErrorResponse(response.error);
        return;
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

  const handleErrorResponse = (error: any) => {
    if (error.message?.includes('Limite de tokens excedido') ||
        error.message?.includes('conversa ficou muito longa')) {
      toast({
        title: "Limite de mensagens atingido",
        description: "A conversa ficou muito longa. Por favor, crie uma nova conversa ou use um modelo diferente.",
        variant: "destructive"
      });
      return;
    }
    throw error;
  };

  return {
    isLoading,
    handleSubmit
  };
};