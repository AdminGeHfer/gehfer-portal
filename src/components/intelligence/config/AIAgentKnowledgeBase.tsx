import { Label } from "@/components/ui/label";
import { DocumentUpload } from "../DocumentUpload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AIAgentKnowledgeBaseProps {
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
  searchType: string;
  onChunkSizeChange: (value: number) => void;
  onChunkOverlapChange: (value: number) => void;
  onEmbeddingModelChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
}

export const AIAgentKnowledgeBase = ({
  chunkSize,
  chunkOverlap,
  embeddingModel,
  searchType,
  onChunkSizeChange,
  onChunkOverlapChange,
  onEmbeddingModelChange,
  onSearchTypeChange,
}: AIAgentKnowledgeBaseProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Upload de Documentos</Label>
        <DocumentUpload />
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
    </div>
  );
};