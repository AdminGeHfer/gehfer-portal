import { useState, useEffect } from "react";
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
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
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
      
      // Invalidate conversations query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      navigate(`/intelligence/chat/${data.id}`);
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast.error("Failed to create new conversation");
    }
  };

  return {
    conversations,
    isLoading,
    createNewConversation
  };
}