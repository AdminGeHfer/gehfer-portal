import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgentType } from "@/types/ai/agent-types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SpecificConfigStepProps {
  data: {
    type: AgentType;
    externalUrl: string;
    authToken: string;
    templateId: string;
  };
  onChange: (data: Partial<SpecificConfigStepProps['data']>) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  agent_type: AgentType;
}

export const SpecificConfigStep = ({ data, onChange }: SpecificConfigStepProps) => {
  const { data: templates } = useQuery({
    queryKey: ['agent-templates', data.type],
    queryFn: async () => {
      const { data: templates, error } = await supabase
        .from('agent_templates')
        .select('*')
        .eq('agent_type', data.type)
        .eq('is_public', true);

      if (error) throw error;
      return templates as Template[];
    },
  });

  if (data.type === 'openai') {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Configuração Específica</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="externalUrl">URL do Serviço</Label>
          <Input
            id="externalUrl"
            value={data.externalUrl}
            onChange={(e) => onChange({ externalUrl: e.target.value })}
            placeholder={`URL do ${data.type === 'n8n' ? 'N8N' : 'Flowise'}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="authToken">Token de Autenticação</Label>
          <Input
            id="authToken"
            type="password"
            value={data.authToken}
            onChange={(e) => onChange({ authToken: e.target.value })}
            placeholder="Token de acesso"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template">Template</Label>
          <Select
            value={data.templateId}
            onValueChange={(value) => onChange({ templateId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um template" />
            </SelectTrigger>
            <SelectContent>
              {templates?.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};