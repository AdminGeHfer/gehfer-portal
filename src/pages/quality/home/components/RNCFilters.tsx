import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RncDepartmentEnum, RncStatusEnum, RncTypeEnum } from "@/types/rnc";
import { SearchBar } from "./filters/SearchBar";

interface RNCFiltersProps {
  filters: {
    searchTerm: string;
    selectedStatus: RncStatusEnum | null;
    selectedType: RncTypeEnum | null;
    selectedDepartment: RncDepartmentEnum | null;
  };
  onFilterChange: (key: string, value) => void;
  onCreateRNC: () => void;
}

export function RNCFilters({ filters, onFilterChange, onCreateRNC }: RNCFiltersProps) {
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className="relative">
          <SearchBar
            searchQuery={filters.searchTerm}
            setSearchQuery={(value) => onFilterChange('searchTerm', value)}
            isSearchExpanded={isSearchExpanded}
            setIsSearchExpanded={setIsSearchExpanded}
          />
        </div>

        <Select
          value={filters.selectedStatus?.toString() || "all"}
          onValueChange={(value) => onFilterChange('selectedStatus', value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-800">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status</SelectItem>
            <SelectItem value={RncStatusEnum.pending}>Pendente</SelectItem>
            <SelectItem value={RncStatusEnum.canceled}>Cancelado</SelectItem>
            <SelectItem value={RncStatusEnum.collect}>Coletado</SelectItem>
            <SelectItem value={RncStatusEnum.concluded}>Solucionado</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.selectedType?.toString() || "all"}
          onValueChange={(value) => onFilterChange('selectedType', value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-800">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tipos</SelectItem>
            <SelectItem value={RncTypeEnum.company_complaint}>Cliente</SelectItem>
            <SelectItem value={RncTypeEnum.supplier}>Fornecedor</SelectItem>
            <SelectItem value={RncTypeEnum.dispatch}>Expedição</SelectItem>
            <SelectItem value={RncTypeEnum.logistics}>Logística</SelectItem>
            <SelectItem value={RncTypeEnum.commercial}>Comercial</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.selectedDepartment?.toString() || "all"}
          onValueChange={(value) => onFilterChange('selectedDepartment', value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full bg-white dark:bg-gray-800">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Departamentos</SelectItem>
            <SelectItem value={RncDepartmentEnum.logistics}>Logística</SelectItem>
            <SelectItem value={RncDepartmentEnum.quality}>Qualidade</SelectItem>
            <SelectItem value={RncDepartmentEnum.financial}>Financeiro</SelectItem>
            <SelectItem value={RncDepartmentEnum.tax}>Fiscal</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={onCreateRNC}
          className="bg-[#4254f5] hover:bg-[#4254f5]/90 text-white h-9 px-4 ml-auto"
        >
          Nova RNC
        </Button>
      </div>
    </div>
  );
}
