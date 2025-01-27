import { useState, useEffect } from "react";
import { RNCType, RNCStatus, RNCDepartment, RNCTableData } from "@/pages/quality/home/types";

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
  const [filteredRNCs, setFilteredRNCs] = useState<RNCTableData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example data - this will be replaced with actual API call later
  const exampleData: RNCTableData[] = [
    {
      company_code: "RNC-001",
      company: "Empresa A",
      type: "company_complaint",
      status: "pending",
      department: "Qualidade",
      date: "2024-03-15",
    },
    {
      company_code: "RNC-002",
      company: "Empresa B",
      type: "supplier",
      status: "collect",
      department: "Logística",
      date: "2024-03-14",
    },
    {
      company_code: "RNC-003",
      company: "Empresa C",
      type: "dispatch",
      status: "concluded",
      department: "Financeiro",
      date: "2024-03-13",
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    try {
      let filtered = [...exampleData];

      if (selectedStatus) {
        filtered = filtered.filter((rnc) => rnc.status === selectedStatus);
      }

      if (selectedType) {
        filtered = filtered.filter((rnc) => rnc.type === selectedType);
      }

      if (selectedDepartment) {
        filtered = filtered.filter((rnc) => rnc.department === selectedDepartment);
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (rnc) =>
            rnc.company_code.toLowerCase().includes(term) ||
            rnc.company.toLowerCase().includes(term)
        );
      }

      setFilteredRNCs(filtered);
      setError(null);
    } catch (err) {
      setError(`Erro ao filtrar RNCs: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, selectedType, selectedDepartment, searchTerm]);

  return { filteredRNCs, isLoading, error };
};