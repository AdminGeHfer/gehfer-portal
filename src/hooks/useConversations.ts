import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export function useConversations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        navigate("/login");
        return [];
      }

      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading conversations:', error);
        toast.error("Failed to load conversations");
        return [];
      }

      return data || [];
    },
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  const createNewConversation = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast.error("You must be logged in to create a conversation");
        navigate("/login");
        return;
      }

      const { data: defaultAgent, error: agentError } = await supabase
        .from('ai_agents')
        .select('id')
        .eq('user_id', session.session.user.id)
        .limit(1)
        .single();

      if (agentError) {
        console.error('Error getting default agent:', agentError);
        toast.error("Failed to get default agent");
        return;
      }

      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          title: 'Nova Conversa',
          user_id: session.session.user.id,
          agent_id: defaultAgent.id
        })
        .select()
        .single();

      if (error) throw error;

      // Update cache immediately
      queryClient.setQueryData(['conversations'], (old: any) => 
        [data, ...(old || [])]
      );
      
      // Also invalidate to ensure fresh data
      await queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      navigate(`/intelligence/chat/${data.id}`);
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast.error("Failed to create new conversation");
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      // Delete messages first
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

      // Update cache immediately and ensure the UI updates
      queryClient.setQueryData(['conversations'], (old: Conversation[] | undefined) => {
        if (!old) return [];
        return old.filter(conv => conv.id !== conversationId);
      });

      // Force a refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['conversations'] });

      toast.success("Conversa excluída com sucesso");
      
      // Navigate only if we're on the deleted conversation's page
      if (window.location.pathname.includes(conversationId)) {
        navigate('/intelligence/chat');
      }
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      toast.error("Erro ao excluir conversa");
    }
  };

  return {
    conversations,
    isLoading,
    createNewConversation,
    deleteConversation
  };
}