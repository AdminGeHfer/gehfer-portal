import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ModelSelector } from "../shared/ModelSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEMORY_OPTIONS } from "./constants";

interface AIAgentBasicConfigProps {
  name: string;
  description: string;
  modelId: string;
  memoryType: string;
  useKnowledgeBase: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onMemoryTypeChange: (value: string) => void;
  onKnowledgeBaseToggle: (value: boolean) => void;
}

export const AIAgentBasicConfig = ({
  name,
  description,
  modelId,
  memoryType,
  useKnowledgeBase,
  onNameChange,
  onDescriptionChange,
  onModelChange,
  onMemoryTypeChange,
  onKnowledgeBaseToggle,
}: AIAgentBasicConfigProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Agente</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ex: Assistente de Qualidade"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Descreva as capacidades do agente..."
        />
      </div>

      <div className="space-y-2">
        <Label>Modelo Base</Label>
        <ModelSelector value={modelId} onValueChange={onModelChange} />
      </div>

      <div className="space-y-2">
        <Label>Tipo de Memória</Label>
        <Select value={memoryType} onValueChange={onMemoryTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de memória" />
          </SelectTrigger>
          <SelectContent>
            {MEMORY_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="useKnowledgeBase"
          checked={useKnowledgeBase}
          onCheckedChange={onKnowledgeBaseToggle}
        />
        <Label htmlFor="useKnowledgeBase">Usar Base de Conhecimento</Label>
      </div>
    </div>
  );
};