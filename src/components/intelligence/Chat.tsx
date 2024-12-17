import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Message } from "@/types/ai";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./chat/MessageList";
import { ChatHeader } from "./chat/ChatHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: conversation, refetch: refetchConversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*, ai_agents(*)')
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) return;

      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      if (data) {
        console.log('Loaded messages:', data);
        setMessages(data);
      }
    };

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`conversation_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('New message received:', payload.new);
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const handleSubmit = async (content: string) => {
    if (!conversationId || !content.trim() || isLoading) return;

    setIsLoading(true);
    try {
      // Create a unique ID for the user message
      const userMessageId = crypto.randomUUID();
      
      // First save the user message
      const { error: messageError } = await supabase
        .from('ai_messages')
        .insert({
          id: userMessageId,
          conversation_id: conversationId,
          content,
          role: 'user',
        });

      if (messageError) throw messageError;

      // Get agent configuration for knowledge base
      const { data: agent, error: agentError } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('id', conversation?.ai_agents?.id)
        .single();

      if (agentError) throw agentError;

      console.log('Agent configuration:', agent);

      // Then call the chat completion function
      const { data: completionData, error: completionError } = await supabase.functions
        .invoke('chat-completion', {
          body: {
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content,
              created_at: msg.created_at
            })).concat({
              role: 'user' as const,
              content,
              created_at: new Date().toISOString()
            }),
            model: conversation?.ai_agents?.model_id || 'gpt-4o-mini',
            agentId: conversation?.ai_agents?.id,
            useKnowledgeBase: agent?.use_knowledge_base || false,
            systemPrompt: agent?.system_prompt || 'You are a helpful assistant.',
          },
        });

      if (completionError) {
        console.error('Completion error:', completionError);
        throw completionError;
      }

      console.log('Completion response:', completionData);

      // Save the AI response
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

  const handleModelChange = async (newModel: string) => {
    if (!conversationId) return;
    
    try {
      const { error } = await supabase
        .from('ai_agents')
        .update({ model_id: newModel })
        .eq('id', conversation?.ai_agents?.id);

      if (error) throw error;
      
      refetchConversation();
      toast.success("Modelo atualizado com sucesso");
    } catch (error) {
      console.error('Error updating model:', error);
      toast.error("Erro ao atualizar modelo");
    }
  };

  const handleDeleteConversation = async () => {
    if (!conversationId || isDeleting) return;

    setIsDeleting(true);
    try {
      // First delete all messages
      const { error: deleteMessagesError } = await supabase
        .from('ai_messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (deleteMessagesError) throw deleteMessagesError;

      // Then delete the conversation
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

  if (!conversationId) return null;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title={conversation?.title || 'Nova Conversa'} 
        model={conversation?.ai_agents?.model_id || ''}
        onModelChange={handleModelChange}
        isDeleting={isDeleting}
        onDelete={handleDeleteConversation}
        isLoading={isLoading}
      />
      
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages} 
          agentId={conversation?.ai_agents?.id || ''} 
          conversationId={conversationId}
        />
      </div>

      <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-col gap-4 py-4">
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};