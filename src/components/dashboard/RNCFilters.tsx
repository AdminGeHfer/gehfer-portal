import * as React from 'react';
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
          <option value="pending">Pendente</option>
          <option value="collect">Coleta</option>
          <option value="concluded">Concluída</option>
          <option value="canceled">Cancelada</option>
        </Select>

        <Select
          value={filters.selectedType || ''}
          onValueChange={(value) => onFilterChange('selectedType', value || null)}
        >
          <option value="">Tipo</option>
          <option value="company_complaint">Reclamação</option>
          <option value="supplier">Fornecedor</option>
          <option value="dispatch">Expedição</option>
          <option value="logistics">Logística</option>
        </Select>

        <Select
          value={filters.selectedDepartment || ''}
          onValueChange={(value) => onFilterChange('selectedDepartment', value || null)}
        >
          <option value="">Departamento</option>
          <option value="logistics">Logística</option>
          <option value="quality">Qualidade</option>
          <option value="financial">Financeiro</option>
          <option value="tax">Fiscal</option>
        </Select>
      </div>
    </div>
  );
}
