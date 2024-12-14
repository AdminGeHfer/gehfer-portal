import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AIAgent } from "@/types/ai/agent";

export function useAgentCreation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const createAgent = async (agentData: Partial<AIAgent>) => {
    try {
      setIsSubmitting(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to create agents",
          variant: "destructive",
        });
        return { success: false };
      }

      const agentDefaults = {
        name: agentData.name || 'New Agent',
        model_id: agentData.model_id || 'gpt-4o-mini',
        memory_type: agentData.memory_type || 'buffer',
        use_knowledge_base: agentData.use_knowledge_base ?? false,
        temperature: agentData.temperature || 0.7,
        max_tokens: agentData.max_tokens || 4000,
        top_p: agentData.top_p || 0.9,
        top_k: agentData.top_k || 50,
        chain_type: agentData.chain_type || 'conversation',
        chunk_size: agentData.chunk_size || 1000,
        chunk_overlap: agentData.chunk_overlap || 200,
        embedding_model: agentData.embedding_model || 'openai',
        search_type: agentData.search_type || 'similarity',
        search_threshold: agentData.search_threshold || 0.7,
        output_format: agentData.output_format || 'text',
        description: agentData.description || '',
        stop_sequences: [...(agentData.stop_sequences || [])],
        tools: [...(agentData.tools || [])],
        system_prompt: agentData.system_prompt || '',
        user_id: session.session.user.id,
        updated_at: new Date().toISOString(),
        agent_type: agentData.agent_type,
        external_url: agentData.external_url,
        auth_token: agentData.auth_token,
        icon: agentData.icon,
        color: agentData.color,
        template_id: agentData.template_id
      };

      const result = await supabase
        .from('ai_agents')
        .insert({
          ...agentDefaults,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      const { error, data: updatedData } = result;
      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent created successfully",
      });

      return { success: true, data: updatedData };
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createAgent,
    isSubmitting
  };
}