import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message } from "@/types/ai";

export const useChatActions = (conversationId: string | undefined) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (content: string) => {
    if (!conversationId || !content.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const userMessageId = crypto.randomUUID();
      
      // Get conversation details including agent
      const { data: conversation, error: convError } = await supabase
        .from('ai_conversations')
        .select('*, ai_agents(*)')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;

      // Insert user message
      const { error: messageError } = await supabase
        .from('ai_messages')
        .insert({
          id: userMessageId,
          conversation_id: conversationId,
          content,
          role: 'user',
        });

      if (messageError) throw messageError;

      // Get previous messages for context
      const { data: previousMessages, error: historyError } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (historyError) throw historyError;

      // Format messages for the completion
      const messages = previousMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        created_at: msg.created_at
      }));

      console.log('Sending request to chat-completion with:', {
        messages,
        model: conversation.ai_agents.model_id,
        agentId: conversation.ai_agents.id,
        useKnowledgeBase: conversation.ai_agents.use_knowledge_base,
        systemPrompt: conversation.ai_agents.system_prompt
      });

      // Call completion with context and agent configuration
      const { data: completionData, error: completionError } = await supabase.functions
        .invoke('chat-completion', {
          body: {
            messages,
            model: conversation.ai_agents.model_id,
            agentId: conversation.ai_agents.id,
            useKnowledgeBase: conversation.ai_agents.use_knowledge_base,
            systemPrompt: conversation.ai_agents.system_prompt,
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
    isLoading
  };
};