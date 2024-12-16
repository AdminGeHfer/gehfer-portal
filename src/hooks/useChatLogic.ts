import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/ai";
import { truncateMessages } from "@/utils/chatUtils";
import { useMemory } from "@/hooks/useMemory";
import { useQueryClient } from "@tanstack/react-query";

export const useChatLogic = (conversationId: string, model: string, agentId: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { initializeMemory } = useMemory(conversationId);
  const queryClient = useQueryClient();

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

    // Immediately update the local cache to show the user message
    queryClient.setQueryData(['messages', conversationId], (oldData: Message[] = []) => {
      return [...oldData, userMessage];
    });

    try {
      // Save user message to Supabase
      const { error: saveError } = await supabase
        .from('ai_messages')
        .insert(userMessage);

      if (saveError) throw saveError;

      // Get existing messages
      const { data: messages, error: messagesError } = await supabase
        .from('ai_messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Initialize memory
      const memory = await initializeMemory();

      console.log('Sending request to chat-completion with:', {
        messages: truncateMessages(
          [...messages, { role: userMessage.role, content: userMessage.content }],
          model
        ),
        model,
        agentId,
      });

      const response = await supabase.functions.invoke('chat-completion', {
        body: {
          messages: truncateMessages(
            [...messages, { role: userMessage.role, content: userMessage.content }],
            model
          ),
          model,
          agentId,
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

      // Update local cache immediately with assistant's response
      queryClient.setQueryData(['messages', conversationId], (oldData: Message[] = []) => {
        return [...oldData, assistantMessage];
      });

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