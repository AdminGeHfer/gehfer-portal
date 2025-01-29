import { useState, useEffect } from "react";
import { RNCWithRelations } from "@/types/rnc";
import { useRNCList } from "./useRNCList";
import { getDepartmentDisplayName, getStatusDisplayName, getTypeDisplayName } from "@/pages/quality/home/utils/colors";
import { RNCDepartment, RNCStatus, RNCType } from "@/pages/quality/home/types";

interface UseRNCsProps {
  selectedStatus: RNCStatus | null;
  selectedType: RNCType | null;
  selectedDepartment: RNCDepartment | null;
  searchTerm: string;
}

export const useRNCs = ({
  selectedStatus,
  selectedType,
  selectedDepartment,
  searchTerm,
}: UseRNCsProps) => {
  const [filteredRNCs, setFilteredRNCs] = useState<RNCWithRelations[]>([]);
  const { rncs, loading: isLoading, error } = useRNCList();

  useEffect(() => {
    try {
      let filtered = [...rncs];

      if (selectedStatus) {
        filtered = filtered.filter((rnc) => getStatusDisplayName(rnc.status) === getStatusDisplayName(selectedStatus));
      }

      if (selectedType) {
        filtered = filtered.filter((rnc) => getTypeDisplayName(rnc.type) === getTypeDisplayName(selectedType));
      }

      if (selectedDepartment) {
        filtered = filtered.filter((rnc) => getDepartmentDisplayName(rnc.department) === getDepartmentDisplayName(selectedDepartment));
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (rnc) =>
            rnc.rnc_number.toString().includes(term) ||
            rnc.company.toLowerCase().includes(term)
        );
      }

      setFilteredRNCs(filtered);
    } catch (err) {
      console.error(`Erro ao filtrar RNCs: ${err.message}`);
    }
  }, [rncs, selectedStatus, selectedType, selectedDepartment, searchTerm]);

  return { filteredRNCs, isLoading, error };
};