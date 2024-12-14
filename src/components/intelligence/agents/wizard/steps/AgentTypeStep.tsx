import { Card } from "@/components/ui/card";
import { Brain, Network, FlowChart } from "lucide-react";
import { AgentType } from "@/types/ai/agent-types";

interface AgentTypeStepProps {
  value: AgentType;
  onChange: (type: AgentType) => void;
}

export const AgentTypeStep = ({ value, onChange }: AgentTypeStepProps) => {
  const types = [
    {
      id: 'openai',
      name: 'Interno (OpenAI)',
      description: 'Agente usando modelos OpenAI',
      icon: Brain,
    },
    {
      id: 'n8n',
      name: 'N8N',
      description: 'Integração com fluxos N8N',
      icon: Network,
    },
    {
      id: 'flowise',
      name: 'Flowise',
      description: 'Integração com Flowise AI',
      icon: FlowChart,
    },
  ];

  return (
    <div className="grid gap-4">
      <h2 className="text-lg font-semibold">Selecione o Tipo de Agente</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        {types.map((type) => (
          <Card
            key={type.id}
            className={`p-4 cursor-pointer transition-colors ${
              value === type.id ? 'border-primary' : ''
            }`}
            onClick={() => onChange(type.id as AgentType)}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <type.icon className="h-8 w-8" />
              <h3 className="font-medium">{type.name}</h3>
              <p className="text-sm text-muted-foreground">
                {type.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};