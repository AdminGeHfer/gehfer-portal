import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AIAgentList } from "@/components/intelligence/agents/AIAgentList";
import { AgentWizard } from "@/components/intelligence/agents/wizard/AgentWizard";
import { useAIAgents } from "@/hooks/useAIAgents";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AIHub = () => {
  const { agents, startChat, updateAgent } = useAIAgents();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const deleteAgent = async (agentId: string) => {
    try {
      const { error: conversationsError } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('agent_id', agentId);

      if (conversationsError) throw conversationsError;

      const { error } = await supabase
        .from('ai_agents')
        .delete()
        .eq('id', agentId);

      if (error) throw error;

      toast.success("Agente excluído com sucesso");
      window.location.reload();
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error("Erro ao excluir agente");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Hub IA" subtitle="Gestão de Agentes IA Especializados" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Agentes IA</h2>
          <Button 
            onClick={() => setIsWizardOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Agente
          </Button>
        </div>

        <AIAgentList
          agents={agents}
          onStartChat={startChat}
          onSaveConfiguration={updateAgent}
          onDelete={deleteAgent}
        />

        <AgentWizard
          open={isWizardOpen}
          onOpenChange={setIsWizardOpen}
        />
      </main>
    </div>
  );
};

export default AIHub;