import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { AgentTrainingHub } from "@/components/intelligence/training/AgentTrainingHub";
import { AgentTrainingSession } from "@/components/intelligence/training/AgentTrainingSession";
import { useAIAgents } from "@/hooks/useAIAgents";
import { toast } from "sonner";

const Training = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const { agents, isLoading } = useAIAgents();

  const handleSelectAgent = (id: string) => {
    setSelectedAgentId(id);
  };

  const handleBack = () => {
    setSelectedAgentId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Treinamento de Agentes" 
        subtitle="Aprimore seus agentes através de sessões de treinamento interativo" 
      />
      
      <main className="container mx-auto px-4 py-8">
        {selectedAgentId ? (
          <AgentTrainingSession
            agentId={selectedAgentId}
            onBack={handleBack}
          />
        ) : (
          <AgentTrainingHub
            agents={agents || []}
            isLoading={isLoading}
            onSelectAgent={handleSelectAgent}
          />
        )}
      </main>
    </div>
  );
};

export default Training;