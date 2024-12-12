import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AI_TOOLS } from "./constants";

interface AIAgentToolsConfigProps {
  tools: string[];
  systemPrompt: string;
  onToolsChange: (tools: string[]) => void;
  onSystemPromptChange: (value: string) => void;
}

export const AIAgentToolsConfig = ({
  tools,
  systemPrompt,
  onToolsChange,
  onSystemPromptChange,
}: AIAgentToolsConfigProps) => {
  const handleToolToggle = (toolId: string, enabled: boolean) => {
    if (enabled) {
      onToolsChange([...tools, toolId]);
    } else {
      onToolsChange(tools.filter(t => t !== toolId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Ferramentas Disponíveis</Label>
        {AI_TOOLS.map((tool) => (
          <div key={tool.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">{tool.name}</h4>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
            <Switch
              checked={tools.includes(tool.id)}
              onCheckedChange={(checked) => handleToolToggle(tool.id, checked)}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="systemPrompt">Prompt do Sistema</Label>
        <Textarea
          id="systemPrompt"
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          placeholder="Defina o comportamento base do agente..."
          className="min-h-[200px]"
        />
      </div>
    </div>
  );
};