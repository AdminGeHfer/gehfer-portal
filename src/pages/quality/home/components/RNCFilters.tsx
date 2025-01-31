import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { RncDepartmentEnum, RncStatusEnum, RncTypeEnum } from "@/types/rnc";

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
  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">RNCs</h2>
        <Button onClick={onCreateRNC}>Nova RNC</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Buscar por número ou empresa..."
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        />

        <Select
          value={filters.selectedStatus || ''}
          onValueChange={(value) => onFilterChange('selectedStatus', value || null)}
        >
          <option value="">Status</option>
          <option value={RncStatusEnum.pending}>Pendente</option>
          <option value={RncStatusEnum.collect}>Coleta</option>
          <option value={RncStatusEnum.concluded}>Concluída</option>
          <option value={RncStatusEnum.canceled}>Cancelada</option>
        </Select>

        <Select
          value={filters.selectedType || ''}
          onValueChange={(value) => onFilterChange('selectedType', value || null)}
        >
          <option value="">Tipo</option>
          <option value={RncTypeEnum.company_complaint}>Reclamação</option>
          <option value={RncTypeEnum.supplier}>Fornecedor</option>
          <option value={RncTypeEnum.dispatch}>Expedição</option>
          <option value={RncTypeEnum.logistics}>Logística</option>
        </Select>

        <Select
          value={filters.selectedDepartment || ''}
          onValueChange={(value) => onFilterChange('selectedDepartment', value || null)}
        >
          <option value="">Departamento</option>
          <option value={RncDepartmentEnum.logistics}>Logística</option>
          <option value={RncDepartmentEnum.quality}>Qualidade</option>
          <option value={RncDepartmentEnum.financial}>Financeiro</option>
          <option value={RncDepartmentEnum.tax}>Fiscal</option>
        </Select>
      </div>
    </div>
  );
}
