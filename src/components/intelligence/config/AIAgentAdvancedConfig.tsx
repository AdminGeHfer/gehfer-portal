import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CHAIN_TYPES, EMBEDDING_MODELS, SEARCH_TYPES } from "./constants";

interface AIAgentAdvancedConfigProps {
  chainType: string;
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
  searchType: string;
  searchThreshold: number;
  outputFormat: string;
  onChainTypeChange: (value: string) => void;
  onChunkSizeChange: (value: number) => void;
  onChunkOverlapChange: (value: number) => void;
  onEmbeddingModelChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
  onSearchThresholdChange: (value: number) => void;
  onOutputFormatChange: (value: string) => void;
}

export const AIAgentAdvancedConfig = ({
  chainType,
  chunkSize,
  chunkOverlap,
  embeddingModel,
  searchType,
  searchThreshold,
  outputFormat,
  onChainTypeChange,
  onChunkSizeChange,
  onChunkOverlapChange,
  onEmbeddingModelChange,
  onSearchTypeChange,
  onSearchThresholdChange,
  onOutputFormatChange,
}: AIAgentAdvancedConfigProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Tipo de Chain</Label>
        <Select value={chainType} onValueChange={onChainTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de chain" />
          </SelectTrigger>
          <SelectContent>
            {CHAIN_TYPES.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tamanho do Chunk</Label>
        <Input
          type="number"
          value={chunkSize}
          onChange={(e) => onChunkSizeChange(Number(e.target.value))}
          min={100}
          max={8000}
        />
      </div>

      <div className="space-y-2">
        <Label>Sobreposição de Chunks</Label>
        <Input
          type="number"
          value={chunkOverlap}
          onChange={(e) => onChunkOverlapChange(Number(e.target.value))}
          min={0}
          max={1000}
        />
      </div>

      <div className="space-y-2">
        <Label>Modelo de Embedding</Label>
        <Select value={embeddingModel} onValueChange={onEmbeddingModelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o modelo de embedding" />
          </SelectTrigger>
          <SelectContent>
            {EMBEDDING_MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tipo de Busca</Label>
        <Select value={searchType} onValueChange={onSearchTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de busca" />
          </SelectTrigger>
          <SelectContent>
            {SEARCH_TYPES.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Limiar de Similaridade</Label>
        <Input
          type="number"
          value={searchThreshold}
          onChange={(e) => onSearchThresholdChange(Number(e.target.value))}
          min={0}
          max={1}
          step={0.1}
        />
      </div>

      <div className="space-y-2">
        <Label>Formato de Saída</Label>
        <Select value={outputFormat} onValueChange={onOutputFormatChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o formato de saída" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Texto</SelectItem>
            <SelectItem value="structured">Estruturado</SelectItem>
            <SelectItem value="markdown">Markdown</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};