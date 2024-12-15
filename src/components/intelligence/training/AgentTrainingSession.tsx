import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrainingChat } from "./TrainingChat";
import { TrainingMetrics } from "./TrainingMetrics";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const AgentTrainingSession = () => {
  const { agentId } = useParams();
  const [activeTab, setActiveTab] = useState("chat");

  const { data: agent, isLoading } = useQuery({
    queryKey: ['ai-agent', agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_agents')
        .select(`
          *,
          agent_training_sessions (
            id,
            score,
            metrics,
            created_at
          )
        `)
        .eq('id', agentId)
        .single();

      if (error) {
        toast.error("Error loading agent");
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
    <div className="container mx-auto py-6">
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="chat">Training Chat</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="chat">
            <TrainingChat agentId={agentId!} />
          </TabsContent>
          <TabsContent value="metrics">
            <TrainingMetrics 
              agentId={agentId!} 
              sessions={agent?.agent_training_sessions || []} 
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};