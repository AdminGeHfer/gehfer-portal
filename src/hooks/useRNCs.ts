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
}

export const useRNCs = ({
  rncs,
  selectedStatus,
  selectedType,
  selectedDepartment,
  searchTerm,
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
            rnc.company.toLowerCase().includes(term)
        );
      }

      setFilteredRNCs(filtered);
    } catch (err) {
      console.error(`Erro ao filtrar RNCs: ${err.message}`);
    }
  }, [rncs, selectedStatus, selectedType, selectedDepartment, searchTerm]);

  return { filteredRNCs };
};
