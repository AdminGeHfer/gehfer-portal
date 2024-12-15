import { AIAgent } from "@/types/ai/agent";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Star, TrendingUp } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AgentTrainingHubProps {
  agents: AIAgent[];
  isLoading: boolean;
  onSelectAgent: (agentId: string) => void;
}

export const AgentTrainingHub = ({ agents, isLoading, onSelectAgent }: AgentTrainingHubProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <Card key={agent.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: agent.color || '#4F46E5' }}
            >
              {agent.icon ? (
                <img src={agent.icon} alt={agent.name} className="w-6 h-6" />
              ) : (
                <Brain className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{agent.name}</h3>
              <p className="text-sm text-muted-foreground">{agent.description}</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-yellow-400 rounded-full"
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium">75%</span>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">
                Melhorou 15% esta semana
              </span>
            </div>
          </div>

          <Button 
            className="w-full"
            onClick={() => onSelectAgent(agent.id)}
          >
            Treinar Agente
          </Button>
        </Card>
      ))}
    </div>
  );
};