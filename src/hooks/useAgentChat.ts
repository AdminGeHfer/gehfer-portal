import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AIAgent } from "@/types/ai/agent";

export function useAgentChat() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const startChat = async (agentId: string, agents: AIAgent[]) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to start a chat",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const { data: existingAgent, error: agentError } = await supabase
        .from('ai_agents')
        .select('id')
        .eq('id', agentId)
        .single();

      if (agentError || !existingAgent) {
        toast({
          title: "Error",
          description: "Agent not found",
          variant: "destructive",
        });
        return;
      }

      const { data: conversation, error } = await supabase
        .from('ai_conversations')
        .insert({
          title: `Chat with ${agents.find(a => a.id === agentId)?.name}`,
          user_id: session.session.user.id,
          agent_id: agentId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        throw error;
      }

      navigate(`/intelligence/chat/${conversation.id}`);
    } catch (error: any) {
      console.error('Error starting chat:', error);
      toast({
        title: "Error",
        description: "Failed to start chat session",
        variant: "destructive",
      });
    }
  };

  return { startChat };
}