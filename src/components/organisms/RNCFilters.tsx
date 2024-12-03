import { Button } from "@/components/atoms/Button";
import { SearchInput } from "@/components/molecules/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RNCFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  workflowStatus: string;
  onWorkflowStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  onClearFilters: () => void;
}

export const RNCFilters = ({
  search,
  onSearchChange,
  workflowStatus,
  onWorkflowStatusChange,
  priority,
  onPriorityChange,
  type,
  onTypeChange,
  onClearFilters,
}: RNCFiltersProps) => {
  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border animate-fade-in">
      <h3 className="font-semibold">Filtros</h3>
      <div className="space-y-4">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Buscar RNCs..."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={workflowStatus} onValueChange={onWorkflowStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="analysis">Em Análise</SelectItem>
              <SelectItem value="resolution">Em Resolução</SelectItem>
              <SelectItem value="solved">Solucionado</SelectItem>
              <SelectItem value="closing">Em Fechamento</SelectItem>
              <SelectItem value="closed">Encerrado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={onPriorityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="client">Cliente</SelectItem>
              <SelectItem value="supplier">Fornecedor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={onClearFilters} className="w-full">
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};