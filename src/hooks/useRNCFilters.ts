import { useState, useEffect } from "react";
import { RNCWithRelations, RncStatusEnum, RncTypeEnum, RncDepartmentEnum } from "@/types/rnc";

interface Filters {
  searchTerm: string;
  selectedStatus: RncStatusEnum | null;
  selectedType: RncTypeEnum | null;
  selectedDepartment: RncDepartmentEnum | null;
}

export const useRNCFilters = (rncs: RNCWithRelations[]) => {
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    selectedStatus: null,
    selectedType: null,
    selectedDepartment: null,
  });

  const [filteredRNCs, setFilteredRNCs] = useState<RNCWithRelations[]>(rncs);

  const handleFilterChange = (key: keyof Filters, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    let filtered = [...rncs];

    // Apply search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (rnc) =>
          rnc.rnc_number.toString().includes(term) ||
          rnc.company.toLowerCase().includes(term) ||
          rnc.korp.toString().includes(term)
      );
    }

    // Apply status filter
    if (filters.selectedStatus) {
      filtered = filtered.filter((rnc) => rnc.status === filters.selectedStatus);
    }

    // Apply type filter
    if (filters.selectedType) {
      filtered = filtered.filter((rnc) => rnc.type === filters.selectedType);
    }

    // Apply department filter
    if (filters.selectedDepartment) {
      filtered = filtered.filter(
        (rnc) => rnc.department === filters.selectedDepartment
      );
    }

    setFilteredRNCs(filtered);
  }, [rncs, filters]);

  return {
    filters,
    handleFilterChange,
    filteredRNCs,
  };
};
