import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const AgentTrainingHub = () => {
  const navigate = useNavigate();

  const { data: agents, isLoading } = useQuery({
    queryKey: ['ai-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_agents')
        .select(`
          id,
          name,
          description,
          icon,
          color,
          agent_training_sessions (
            id,
            score,
            metrics
          )
        `);

      if (error) {
        toast.error("Error loading agents");
        throw error;
      }

      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {agents?.map((agent) => {
        const latestSession = agent.agent_training_sessions?.[0];
        const score = latestSession?.score || 0;

        return (
          <Card 
            key={agent.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/intelligence/training/${agent.id}`)}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                {agent.icon ? (
                  <img src={agent.icon} alt={agent.name} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${agent.color || 'bg-primary'}`}>
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <CardTitle>{agent.name}</CardTitle>
                  <CardDescription>{agent.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Performance Score</div>
                <div className="text-lg font-semibold">{score}%</div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${score}%` }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};