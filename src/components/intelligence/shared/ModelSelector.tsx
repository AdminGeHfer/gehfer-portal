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
    name: 'GPT-4 Mini',
    description: 'Rápido e eficiente para tarefas simples',
    maxTokens: 4096,
    contextWindow: 8192
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4',
    description: 'Mais poderoso para tarefas complexas',
    maxTokens: 8192,
    contextWindow: 32768
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral-8x7B',
    description: 'Modelo open source com contexto extenso',
    maxTokens: 32768,
    contextWindow: 32768
  },
  {
    id: 'llama2-70b-4096',
    name: 'LLaMA-2 70B',
    description: 'Modelo versátil de alta performance',
    maxTokens: 4096,
    contextWindow: 8192
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