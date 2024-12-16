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
    id: 'gpt-3.5-turbo-1106',
    name: 'GPT-3.5 Turbo',
    description: 'Rápido e eficiente para tarefas simples',
    maxTokens: 4096,
    contextWindow: 16385
  },
  {
    id: 'gpt-4-1106-preview',
    name: 'GPT-4 Turbo',
    description: 'Mais poderoso para tarefas complexas',
    maxTokens: 4096,
    contextWindow: 128000
  },
  {
    id: 'gpt-4-vision-preview',
    name: 'GPT-4 Vision',
    description: 'Capaz de analisar imagens e texto',
    maxTokens: 4096,
    contextWindow: 128000
  },
  {
    id: 'gpt-3.5-turbo-16k',
    name: 'GPT-3.5 Turbo 16k',
    description: 'Versão com contexto expandido',
    maxTokens: 16384,
    contextWindow: 16384
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