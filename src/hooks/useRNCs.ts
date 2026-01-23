import { useState, useEffect } from "react";
import { RNCWithRelations, RncStatusEnum, RncTypeEnum, RncDepartmentEnum } from "@/types/rnc";
import { 
  getStatusDisplayName, 
  getTypeDisplayName, 
  getDepartmentDisplayName 
} from "@/pages/quality/home/utils/colors";

interface FilterProps {
  rncs: RNCWithRelations[];
  selectedStatus: RncStatusEnum | null;
  selectedType: RncTypeEnum | null;
  selectedDepartment: RncDepartmentEnum | null;
  searchTerm: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

export const useRNCs = ({
  rncs,
  selectedStatus,
  selectedType,
  selectedDepartment,
  searchTerm,
  startDate,
  endDate,
}: FilterProps) => {
  const [filteredRNCs, setFilteredRNCs] = useState<RNCWithRelations[]>(rncs || []);

  useEffect(() => {
    try {
      let filtered = rncs ? [...rncs] : [];

      if (selectedStatus) {
        filtered = filtered.filter((rnc) => 
          getStatusDisplayName(rnc.status) === getStatusDisplayName(selectedStatus)
        );
      }

      if (selectedType) {
        filtered = filtered.filter((rnc) => 
          getTypeDisplayName(rnc.type) === getTypeDisplayName(selectedType)
        );
      }

      if (selectedDepartment) {
        filtered = filtered.filter((rnc) => 
          getDepartmentDisplayName(rnc.department) === getDepartmentDisplayName(selectedDepartment)
        );
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (rnc) =>
            rnc.rnc_number?.toString().includes(term) ||
            rnc.company.toLowerCase().includes(term) ||
            rnc.korp?.toString().includes(term)
        );
      }

      // Apply start date filter (closed_at >= startDate)
      if (startDate) {
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        filtered = filtered.filter((rnc) => {
          if (!rnc.closed_at) return false;
          const closedAt = new Date(rnc.closed_at);
          return closedAt >= startOfDay;
        });
      }

      // Apply end date filter (closed_at <= endDate)
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        filtered = filtered.filter((rnc) => {
          if (!rnc.closed_at) return false;
          const closedAt = new Date(rnc.closed_at);
          return closedAt <= endOfDay;
        });
      }

      setFilteredRNCs(filtered);
    } catch (err) {
      console.error(`Erro ao filtrar RNCs: ${(err as Error).message}`);
    }
  }, [rncs, selectedStatus, selectedType, selectedDepartment, searchTerm, startDate, endDate]);

  return { filteredRNCs };
};
