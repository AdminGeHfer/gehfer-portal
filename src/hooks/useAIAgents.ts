import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AIAgent } from "@/types/ai/agent";

export function useAIAgents() {
  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: "123e4567-e89b-12d3-a456-426614174000", // Using proper UUID format
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
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
  ]);

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

      const { data: conversation, error } = await supabase
        .from('ai_conversations')
        .insert({
          title: `Chat with ${agents.find(a => a.id === agentId)?.name}`,
          user_id: session.session.user.id
        })
        .select()
        .single();

      if (error) throw error;

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
      const { error } = await supabase
        .from('ai_agents')
        .update(updatedAgent)
        .eq('id', agentId);

      if (error) throw error;

      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, ...updatedAgent }
          : agent
      ));

      return { success: true };
    } catch (error) {
      console.error('Error updating agent:', error);
      return { success: false, error };
    }
  };

  return {
    agents,
    startChat,
    updateAgent
  };
}