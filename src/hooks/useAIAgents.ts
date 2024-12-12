import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AIAgent } from "@/types/ai/agent";

export function useAIAgents() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startChat = async (agentId: string) => {
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

      // First check if agent exists
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
          user_id: session.session.user.id
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

  const updateAgent = async (agentId: string, updatedAgent: Partial<AIAgent>) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to update agents",
          variant: "destructive",
        });
        return { success: false };
      }

      // Ensure required fields are present
      const agentUpdate = {
        ...updatedAgent,
        model_id: updatedAgent.model_id || 'gpt-4o-mini',
        user_id: session.session.user.id,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('ai_agents')
        .update(agentUpdate)
        .eq('id', agentId)
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      // Update local state
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, ...updatedAgent }
          : agent
      ));

      toast({
        title: "Success",
        description: "Agent configuration saved successfully",
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: "Failed to save agent configuration",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const loadAgents = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        console.warn('No authenticated user found');
        return;
      }

      // First try to get user's agents
      let { data: userAgents, error: userAgentsError } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('user_id', session.session.user.id);

      if (userAgentsError) throw userAgentsError;

      // If user has no agents, create default one
      if (!userAgents || userAgents.length === 0) {
        const defaultAgent = {
          name: "Assistente de Qualidade",
          description: "Especializado em análise de RNCs e processos de qualidade",
          model_id: "gpt-4o-mini",
          memory_type: "buffer",
          use_knowledge_base: true,
          temperature: 0.7,
          max_tokens: 4000,
          top_p: 0.9,
          top_k: 50,
          stop_sequences: [],
          chain_type: "conversation",
          chunk_size: 1000,
          chunk_overlap: 200,
          embedding_model: "openai",
          search_type: "similarity",
          search_threshold: 0.7,
          output_format: "text",
          tools: [],
          system_prompt: "Você é um assistente especializado em qualidade, focado em análise de RNCs e melhoria de processos.",
          user_id: session.session.user.id
        } as const;

        const { data: newAgent, error: createError } = await supabase
          .from('ai_agents')
          .insert(defaultAgent)
          .select()
          .single();

        if (createError) throw createError;
        
        userAgents = [newAgent];
      }

      setAgents(userAgents);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast({
        title: "Error",
        description: "Failed to load AI agents",
        variant: "destructive",
      });
    }
  };

  // Load agents on mount
  useEffect(() => {
    loadAgents();
  }, []);

  return {
    agents,
    startChat,
    updateAgent,
    isLoading: agents.length === 0
  };
}