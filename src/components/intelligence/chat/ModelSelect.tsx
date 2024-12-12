import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain } from "lucide-react"

interface ModelSelectProps {
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
}

export const ModelSelect = ({ value, onValueChange, disabled }: ModelSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-[200px] bg-background/50">
        <Brain className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Selecione o modelo" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gpt-4o-mini">GPT-4 Mini</SelectItem>
        <SelectItem value="gpt-4o">GPT-4</SelectItem>
        <SelectItem value="mixtral-8x7b-32768">Mixtral-8x7B (32k)</SelectItem>
        <SelectItem value="llama2-70b-4096">LLaMA-2 70B</SelectItem>
      </SelectContent>
    </Select>
  )
}