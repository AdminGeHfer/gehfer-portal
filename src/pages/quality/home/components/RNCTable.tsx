import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { RNCWithRelations } from "@/types/rnc";
import { 
  getStatusColor, 
  getTypeColor, 
  getDepartmentColor,
  getStatusDisplayName,
  getDepartmentDisplayName,
  getTypeDisplayName 
} from "../utils/colors";

interface RNCTableProps {
  rncs: RNCWithRelations[];
  onEdit: (rnc: RNCWithRelations) => void;
  onDelete: (rnc: RNCWithRelations) => void;
  isLoading: boolean;
}

export function RNCTable({ rncs, onEdit, onDelete, isLoading }: RNCTableProps) {
  const navigate = useNavigate();

  if (isLoading || !rncs) {
    return <div>Carregando RNCs...</div>;
  }

  const handleRowClick = (id: string) => {
    navigate(`/quality/rnc/${id}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rncs.map((rnc) => (
            <TableRow 
              key={rnc.id}
              className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={() => handleRowClick(rnc.id)}
            >
              <TableCell>{rnc.rnc_number}</TableCell>
              <TableCell>
                {new Date(rnc.created_at).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>{rnc.company}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(getStatusDisplayName(rnc.status))}>
                  {getStatusDisplayName(rnc.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getTypeColor(getTypeDisplayName(rnc.type))}>
                  {getTypeDisplayName(rnc.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getDepartmentColor(getDepartmentDisplayName(rnc.department))}>
                  {getDepartmentDisplayName(rnc.department)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(rnc);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(rnc);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// src/pages/quality/home/components/RNCFilters.tsx
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
  onFilterChange: (key: string, value: any) => void;
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

// src/pages/quality/home/utils/colors.ts
import { RncDepartmentEnum, RncStatusEnum, RncTypeEnum } from "@/types/rnc";

export const getStatusDisplayName = (status: RncStatusEnum): string => {
  const statusMap = {
    [RncStatusEnum.not_created]: 'Não Criada',
    [RncStatusEnum.pending]: 'Pendente',
    [RncStatusEnum.collect]: 'Coleta',
    [RncStatusEnum.concluded]: 'Concluída',
    [RncStatusEnum.canceled]: 'Cancelada'
  };
  return statusMap[status] || status;
};

export const getTypeDisplayName = (type: RncTypeEnum): string => {
  const typeMap = {
    [RncTypeEnum.company_complaint]: 'Reclamação',
    [RncTypeEnum.supplier]: 'Fornecedor',
    [RncTypeEnum.dispatch]: 'Expedição',
    [RncTypeEnum.logistics]: 'Logística',
    [RncTypeEnum.deputy]: 'Representante',
    [RncTypeEnum.driver]: 'Motorista',
    [RncTypeEnum.financial]: 'Financeiro',
    [RncTypeEnum.commercial]: 'Comercial',
    [RncTypeEnum.financial_agreement]: 'Acordo Financeiro'
  };
  return typeMap[type] || type;
};

export const getDepartmentDisplayName = (department: RncDepartmentEnum): string => {
  const departmentMap = {
    [RncDepartmentEnum.logistics]: 'Logística',
    [RncDepartmentEnum.quality]: 'Qualidade',
    [RncDepartmentEnum.financial]: 'Financeiro',
    [RncDepartmentEnum.tax]: 'Fiscal'
  };
  return departmentMap[department] || department;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'Pendente': 'bg-yellow-500 hover:bg-yellow-600',
    'Coleta': 'bg-blue-500 hover:bg-blue-600',
    'Concluída': 'bg-green-500 hover:bg-green-600',
    'Cancelada': 'bg-red-500 hover:bg-red-600',
    'Não Criada': 'bg-gray-500 hover:bg-gray-600'
  };
  return colorMap[status] || 'bg-gray-500 hover:bg-gray-600';
};

export const getTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    'Reclamação': 'bg-red-500 hover:bg-red-600',
    'Fornecedor': 'bg-purple-500 hover:bg-purple-600',
    'Expedição': 'bg-blue-500 hover:bg-blue-600',
    'Logística': 'bg-green-500 hover:bg-green-600',
    'Representante': 'bg-yellow-500 hover:bg-yellow-600',
    'Motorista': 'bg-orange-500 hover:bg-orange-600',
    'Financeiro': 'bg-indigo-500 hover:bg-indigo-600',
    'Comercial': 'bg-pink-500 hover:bg-pink-600',
    'Acordo Financeiro': 'bg-cyan-500 hover:bg-cyan-600'
  };
  return colorMap[type] || 'bg-gray-500 hover:bg-gray-600';
};

export const getDepartmentColor = (department: string): string => {
  const colorMap: Record<string, string> = {
    'Logística': 'bg-blue-500 hover:bg-blue-600',
    'Qualidade': 'bg-green-500 hover:bg-green-600',
    'Financeiro': 'bg-purple-500 hover:bg-purple-600',
    'Fiscal': 'bg-orange-500 hover:bg-orange-600'
  };
  return colorMap[department] || 'bg-gray-500 hover:bg-gray-600';
};
