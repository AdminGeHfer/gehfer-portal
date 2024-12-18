import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message } from "@/types/ai";
import { useQuery } from "@tanstack/react-query";

export const useChatActions = (conversationId: string | undefined) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Updated query to include all necessary agent fields
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
            top_p
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
      // Get existing conversation messages
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
          role: 'user',
        });

      if (messageError) throw messageError;

      // Prepare messages array with full conversation history
      const messages = [
        ...(existingMessages || []).map(msg => ({
          role: msg.role,
          content: msg.content,
          created_at: msg.created_at
        })),
        { 
          role: 'user', 
          content, 
          created_at: new Date().toISOString() 
        }
      ];

      console.log('Sending chat completion request with config:', {
        messages,
        model: conversation.ai_agents.model_id,
        systemPrompt: conversation.ai_agents.system_prompt,
        useKnowledgeBase: conversation.ai_agents.use_knowledge_base
      });

      const { data: completionData, error: completionError } = await supabase.functions
        .invoke('chat-completion', {
          body: {
            messages,
            model: conversation.ai_agents.model_id,
            systemPrompt: conversation.ai_agents.system_prompt,
            useKnowledgeBase: conversation.ai_agents.use_knowledge_base,
            temperature: conversation.ai_agents.temperature,
            maxTokens: conversation.ai_agents.max_tokens,
            topP: conversation.ai_agents.top_p,
            agentId: conversation.ai_agents.id
          },
        });

      if (completionError) throw completionError;

      if (completionData?.choices?.[0]?.message?.content) {
        const { error: aiMessageError } = await supabase
          .from('ai_messages')
          .insert({
            conversation_id: conversationId,
            content: completionData.choices[0].message.content,
            role: 'assistant',
          });

        if (aiMessageError) throw aiMessageError;
      }

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