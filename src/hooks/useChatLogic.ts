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

    try {
      // Immediately save and display user message
      const { error: saveError } = await supabase
        .from('ai_messages')
        .insert(userMessage);

      if (saveError) throw saveError;

      // Start loading state for AI response
      setIsLoading(true);

      // Initialize memory in parallel with getting messages
      const memoryPromise = initializeMemory();
      
      // Fetch messages in parallel
      const messagesPromise = supabase
        .from('ai_messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      // Wait for both operations to complete
      const [memory, { data: messages }] = await Promise.all([
        memoryPromise,
        messagesPromise
      ]);

      const truncatedMessages = truncateMessages(
        [...(messages || []), { role: userMessage.role, content: userMessage.content }],
        model
      );

      const memoryVariables = await memory.loadMemoryVariables({
        input: userMessage.content
      });

      console.log('Sending request to chat-completion with:', {
        messages: truncatedMessages,
        model,
        agentId,
        memory: memoryVariables
      });

      const response = await supabase.functions.invoke('chat-completion', {
        body: {
          messages: truncatedMessages,
          model,
          agentId,
          memory: memoryVariables
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

      await memory.saveContext(
        { input: userMessage.content },
        { output: assistantMessage.content }
      );

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