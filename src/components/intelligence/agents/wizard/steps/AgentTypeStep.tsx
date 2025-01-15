import * as React from "react";
import { Card } from "@/components/ui/card";
import { Brain, Network, GitBranch } from "lucide-react";
import { AgentType } from "@/types/ai/agent-types";

interface AgentTypeStepProps {
  value: AgentType;
  onChange: (type: AgentType) => void;
}

export const AgentTypeStep = ({ value, onChange }: AgentTypeStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Tipo de Agente</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className={`p-4 cursor-pointer hover:border-primary transition-colors ${
            value === 'openai' ? 'border-2 border-primary' : ''
          }`}
          onClick={() => onChange('openai')}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Interno</h3>
            <p className="text-sm text-muted-foreground">
              OpenAI, Claude, etc
            </p>
          </div>
        </Card>

        <Card
          className={`p-4 cursor-pointer hover:border-primary transition-colors ${
            value === 'n8n' ? 'border-2 border-primary' : ''
          }`}
          onClick={() => onChange('n8n')}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Network className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">N8N</h3>
            <p className="text-sm text-muted-foreground">
              Automação com N8N
            </p>
          </div>
        </Card>

        <Card
          className={`p-4 cursor-pointer hover:border-primary transition-colors ${
            value === 'flowise' ? 'border-2 border-primary' : ''
          }`}
          onClick={() => onChange('flowise')}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GitBranch className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium">Flowise</h3>
            <p className="text-sm text-muted-foreground">
              Fluxos com Flowise
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};