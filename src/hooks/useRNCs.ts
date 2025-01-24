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
      number: "RNC-001",
      company: "Empresa A",
      type: "Reclamação do Cliente",
      status: "Pendente",
      department: "Qualidade",
      date: "2024-03-15",
    },
    {
      number: "RNC-002",
      company: "Empresa B",
      type: "Fornecedor",
      status: "Coletado",
      department: "Logística",
      date: "2024-03-14",
    },
    {
      number: "RNC-003",
      company: "Empresa C",
      type: "Logística",
      status: "Solucionado",
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
            rnc.number.toLowerCase().includes(term) ||
            rnc.company.toLowerCase().includes(term)
        );
      }

      setFilteredRNCs(filtered);
      setError(null);
    } catch (err) {
      setError("Erro ao filtrar RNCs");
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, selectedType, selectedDepartment, searchTerm]);

  return { filteredRNCs, isLoading, error };
};