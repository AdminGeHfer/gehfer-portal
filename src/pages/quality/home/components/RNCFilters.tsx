import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { RncDepartmentEnum, RncStatusEnum, RncTypeEnum } from "@/types/rnc";
import { SearchBar } from "./filters/SearchBar";

interface RNCFiltersProps {
  filters: {
    searchTerm: string;
    selectedStatus: RncStatusEnum | null;
    selectedType: RncTypeEnum | null;
    selectedDepartment: RncDepartmentEnum | null;
    startDate: Date | null;
    endDate: Date | null;
  };
  onFilterChange: (key: string, value: unknown) => void;
  onCreateRNC: () => void;
}

export function RNCFilters({ filters, onFilterChange, onCreateRNC }: RNCFiltersProps) {
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
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

        {/* Start Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-white dark:bg-gray-800",
                !filters.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate ? format(filters.startDate, "dd/MM/yyyy") : <span>Data Início</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.startDate || undefined}
              onSelect={(date) => onFilterChange('startDate', date || null)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {/* End Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-white dark:bg-gray-800",
                !filters.endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.endDate ? format(filters.endDate, "dd/MM/yyyy") : <span>Data Fim</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.endDate || undefined}
              onSelect={(date) => onFilterChange('endDate', date || null)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          onClick={onCreateRNC}
          className="bg-[#4254f5] hover:bg-[#4254f5]/90 text-white h-9 px-4"
        >
          Nova RNC
        </Button>
      </div>
    </div>
  );
}
