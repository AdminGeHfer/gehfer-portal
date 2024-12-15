import { AIAgent } from "@/types/ai/agent";
import { Loader } from "lucide-react";

interface AgentTrainingHubProps {
  agents: AIAgent[];
  isLoading: boolean;
  onSelectAgent: (id: string) => void;
}

export const AgentTrainingHub = ({ agents, isLoading, onSelectAgent }: AgentTrainingHubProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map(agent => (
        <div key={agent.id} className="p-4 border rounded-lg hover:shadow-lg cursor-pointer" onClick={() => onSelectAgent(agent.id)}>
          <h3 className="text-lg font-semibold">{agent.name}</h3>
          <p className="text-sm text-muted-foreground">{agent.description}</p>
        </div>
      ))}
    </div>
  );
};
