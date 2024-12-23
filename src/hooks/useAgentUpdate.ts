import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AIAgent, AIAgentConfig, configToAgent } from "@/types/ai/agent";

export function useAgentUpdate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateAgent = async (agentId: string, updatedAgent: Partial<AIAgent> | AIAgentConfig) => {
    try {
      setIsSubmitting(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to update agents",
          variant: "destructive",
        });
        return { success: false };
      }

      // Convert config format to database format if needed
      const dbFormat = 'chainType' in updatedAgent 
        ? configToAgent(updatedAgent as AIAgentConfig, session.session.user.id)
        : updatedAgent;

      const result = await supabase
        .from('ai_agents')
        .update({
          ...dbFormat,
          updated_at: new Date().toISOString()
        })
        .eq('id', agentId)
        .eq('user_id', session.session.user.id)
        .select()
        .single();

      const { error, data: updatedData } = result;
      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent updated successfully",
      });

      return { success: true, data: updatedData };
    } catch (error) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    updateAgent,
    isSubmitting
  };
}