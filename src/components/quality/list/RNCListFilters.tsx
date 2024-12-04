import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkflowStatusEnum } from "@/types/rnc";

interface RNCListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  priorityFilter: string;
  onPriorityChange: (value: string) => void;
}

export const RNCListFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  departmentFilter,
  onDepartmentChange,
  priorityFilter,
  onPriorityChange,
}: RNCListFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar RNCs..." 
          className="pl-10" 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Status</SelectItem>
          <SelectItem value="open">Aberto</SelectItem>
          <SelectItem value="analysis">Em Análise</SelectItem>
          <SelectItem value="resolution">Em Resolução</SelectItem>
          <SelectItem value="solved">Solucionado</SelectItem>
          <SelectItem value="closing">Em Fechamento</SelectItem>
          <SelectItem value="closed">Encerrado</SelectItem>
        </SelectContent>
      </Select>
      <Select value={departmentFilter} onValueChange={onDepartmentChange}>
        <SelectTrigger>
          <SelectValue placeholder="Departamento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Departamentos</SelectItem>
          <SelectItem value="Expedição">Expedição</SelectItem>
          <SelectItem value="Logistica">Logística</SelectItem>
          <SelectItem value="Comercial">Comercial</SelectItem>
          <SelectItem value="Qualidade">Qualidade</SelectItem>
        </SelectContent>
      </Select>
      <Select value={priorityFilter} onValueChange={onPriorityChange}>
        <SelectTrigger>
          <SelectValue placeholder="Prioridade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Prioridades</SelectItem>
          <SelectItem value="low">Baixa</SelectItem>
          <SelectItem value="medium">Média</SelectItem>
          <SelectItem value="high">Alta</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};