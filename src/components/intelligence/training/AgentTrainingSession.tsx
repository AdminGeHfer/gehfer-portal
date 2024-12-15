import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import { useAIAgents } from "@/hooks/useAIAgents";
import { TrainingChat } from "./TrainingChat";
import { TrainingMetrics } from "./TrainingMetrics";

interface AgentTrainingSessionProps {
  agentId: string;
  onBack: () => void;
}

export const AgentTrainingSession = ({ agentId, onBack }: AgentTrainingSessionProps) => {
  const { agents } = useAIAgents();
  const agent = agents.find(a => a.id === agentId);
  const [activeTab, setActiveTab] = useState("chat");

  if (!agent) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-semibold">Treinando: {agent.name}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="chat">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat de Treinamento
              </TabsTrigger>
              <TabsTrigger value="metrics">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Métricas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat">
              <TrainingChat agentId={agentId} />
            </TabsContent>
            
            <TabsContent value="metrics">
              <TrainingMetrics agentId={agentId} />
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Avaliação Rápida</h3>
          
          <div className="space-y-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {}}
            >
              <ThumbsUp className="w-4 h-4 mr-2 text-emerald-500" />
              Resposta Excelente
            </Button>

            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {}}
            >
              <ThumbsUp className="w-4 h-4 mr-2 text-yellow-500" />
              Resposta Boa
            </Button>

            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {}}
            >
              <ThumbsDown className="w-4 h-4 mr-2 text-red-500" />
              Resposta Inadequada
            </Button>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-2">Tags Comuns</h4>
            <div className="flex flex-wrap gap-2">
              {['Técnico', 'Comercial', 'Atendimento', 'Produto'].map(tag => (
                <Button
                  key={tag}
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};