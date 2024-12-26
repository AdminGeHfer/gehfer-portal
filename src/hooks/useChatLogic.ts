import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/ai";
import { useQueryClient } from "@tanstack/react-query";
import { EnhancedConversationChain } from "@/lib/langchain/chains/EnhancedConversationChain";

export const useChatLogic = (conversationId: string, model: string, agentId: string | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (content: string) => {
    if (!conversationId || !content.trim() || !agentId) {
      if (!content.trim()) {
        toast({
          title: "Mensagem vazia",
          description: "Por favor, digite uma mensagem antes de enviar.",
          variant: "destructive",
        });
      }
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    setIsLoading(true);

    // Update local cache immediately
    queryClient.setQueryData(['messages', conversationId], (oldData: Message[] = []) => {
      return [...oldData, userMessage];
    });

    try {
      // Save user message
      const { error: saveError } = await supabase
        .from('ai_messages')
        .insert(userMessage);

      if (saveError) throw saveError;

      // Get agent configuration
      const { data: agent, error: agentError } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (agentError) throw agentError;

      // Get conversation history
      const { data: messages = [], error: messagesError } = await supabase
        .from('ai_messages')
        .select('id, conversation_id, role, content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Create conversation chain with enhanced features
      const conversationChain = new EnhancedConversationChain(agent, conversationId);

      // Process message with enhanced context and memory
      const response = await conversationChain.processMessage(content, messages);

      // Create assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role: 'assistant',
        content: response,
        created_at: new Date().toISOString(),
      };

      // Update local cache
      queryClient.setQueryData(['messages', conversationId], (oldData: Message[] = []) => {
        return [...oldData, assistantMessage];
      });

      // Save assistant message
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