import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { AgentTrainingHub } from "@/components/intelligence/training/AgentTrainingHub";
import { AgentTrainingSession } from "@/components/intelligence/training/AgentTrainingSession";
import { useAIAgents } from "@/hooks/useAIAgents";

const Training = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const { agents, isLoading } = useAIAgents();

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Treinamento de Agentes" 
        subtitle="Melhore o desempenho dos seus agentes através de feedback" 
      />
      
      <main className="container mx-auto px-4 py-8">
        {selectedAgentId ? (
          <AgentTrainingSession
            agentId={selectedAgentId}
            onBack={() => setSelectedAgentId(null)}
          />
        ) : (
          <AgentTrainingHub
            agents={agents}
            isLoading={isLoading}
            onSelectAgent={setSelectedAgentId}
          />
        )}
      </main>
    </div>
  );
};

export default Training;