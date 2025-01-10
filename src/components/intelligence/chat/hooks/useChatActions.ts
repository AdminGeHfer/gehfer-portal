import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { EnhancedConversationChain } from "@/lib/langchain/chains/EnhancedConversationChain";
import { Message } from "@/types/ai";
import { AIAgent } from "@/types/ai/agent";

export const useChatActions = (conversationId: string | undefined) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const { data, error } = await supabase
        .from('ai_conversations')
        .select(`
          *,
          ai_agents!inner(
            id,
            name,
            model_id,
            system_prompt,
            use_knowledge_base,
            temperature,
            max_tokens,
            top_p,
            top_k,
            stop_sequences,
            chain_type,
            memory_type,
            chunk_size,
            chunk_overlap,
            embedding_model,
            search_type,
            search_threshold,
            output_format,
            tools,
            user_id,
            created_at,
            updated_at,
            agent_type
          )
        `)
        .eq('id', conversationId)
        .single();

      if (error) {
        console.error('Error fetching conversation:', error);
        throw error;
      }
      
      console.log('Loaded conversation with agent config:', data);
      return data;
    },
    enabled: !!conversationId
  });

  const handleSubmit = async (content: string) => {
    if (!conversationId || !content.trim() || isLoading) return;
    if (!conversation?.ai_agents) {
      toast.error("No agent configuration found");
      return;
    }

    setIsLoading(true);
    try {
      const { data: existingMessages, error: messagesError } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      const userMessageId = crypto.randomUUID();
      
      const { error: messageError } = await supabase
        .from('ai_messages')
        .insert({
          id: userMessageId,
          conversation_id: conversationId,
          content,
          role: 'user' as const,
        });

      if (messageError) throw messageError;

      // Create conversation chain with enhanced features
      const agent = conversation.ai_agents as AIAgent;
      const conversationChain = new EnhancedConversationChain(agent, conversationId);

      // Process message with enhanced context and memory
      const response = await conversationChain.processMessage(content, existingMessages || []);

      // Create assistant message
      const assistantMessage = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role: 'assistant' as const,
        content: response,
        created_at: new Date().toISOString(),
      };

      const { error: saveAiError } = await supabase
        .from('ai_messages')
        .insert(assistantMessage);

      if (saveAiError) throw saveAiError;

    } catch (error: any) {
      console.error('Error in chat flow:', error);
      toast.error("Erro ao processar mensagem");
    } finally {
      setIsLoading(false);
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

      toast.success("Conversa excluída com sucesso");
      navigate('/intelligence/chat');
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      toast.error("Erro ao excluir conversa");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleSubmit,
    handleDeleteConversation,
    isDeleting,
    isLoading,
    conversation
  };
};