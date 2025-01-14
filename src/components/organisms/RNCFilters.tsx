import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  status: string;
  onStatusChange: (value: string) => void;
  department: string;
  onDepartmentChange: (value: string) => void;
  onClearFilters: () => void;
}

export const RNCFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  department,
  onDepartmentChange,
  onClearFilters,
}: RNCFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar por empresa ou Nº RNC..." 
          className="pl-10" 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={status} onValueChange={onStatusChange}>
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
      <Select value={department} onValueChange={onDepartmentChange}>
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
      <Button variant="outline" onClick={onClearFilters} className="w-full">
        Limpar Filtros
      </Button>
    </div>
  );
};