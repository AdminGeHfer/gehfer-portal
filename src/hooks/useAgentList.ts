import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AIAgent } from "@/types/ai/agent";

export function useAgentList() {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadAgents = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        console.warn('No authenticated user found');
        return;
      }

      let { data: userAgents, error: userAgentsError } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('user_id', session.session.user.id);

      if (userAgentsError) throw userAgentsError;

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
          stop_sequences: [] as string[],
          chain_type: "conversation",
          chunk_size: 1000,
          chunk_overlap: 200,
          embedding_model: "openai",
          search_type: "similarity",
          search_threshold: 0.7,
          output_format: "text",
          tools: [] as string[],
          system_prompt: "Você é um assistente especializado em qualidade, focado em análise de RNCs e melhoria de processos.",
          user_id: session.session.user.id
        } as const;

        const { data: newAgent, error: createError } = await supabase
          .from('ai_agents')
          .insert({...defaultAgent})
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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const refreshAgents = useCallback(() => loadAgents(), [loadAgents]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  return {
    agents,
    refreshAgents,
    isLoading: agents.length === 0
  };
}