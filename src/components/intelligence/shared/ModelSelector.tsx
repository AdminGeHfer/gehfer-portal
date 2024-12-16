import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain } from "lucide-react"

export interface AIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  contextWindow: number;
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Versão otimizada do GPT-4',
    maxTokens: 4096,
    contextWindow: 16385
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Mais poderoso para tarefas complexas',
    maxTokens: 4096,
    contextWindow: 128000
  }
];

interface ModelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const ModelSelector = ({ value, onValueChange, disabled }: ModelSelectorProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-[200px] bg-background/50">
        <Brain className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Selecione o modelo" />
      </SelectTrigger>
      <SelectContent>
        {AI_MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}