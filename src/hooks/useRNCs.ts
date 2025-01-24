import { useState, useEffect } from "react";

interface RNCStatus {
  value: string;
  label: string;
}

interface RNCType {
  value: string;
  label: string;
}

interface RNCDepartment {
  value: string;
  label: string;
}

interface RNCTableData {
  number: string;
  company: string;
  type: string;
  status: string;
  department: string;
  date: string;
}

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
        filtered = filtered.filter((rnc) => rnc.status === selectedStatus.value);
      }

      if (selectedType) {
        filtered = filtered.filter((rnc) => rnc.type === selectedType.value);
      }

      if (selectedDepartment) {
        filtered = filtered.filter((rnc) => rnc.department === selectedDepartment.value);
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
    } catch (err: any) {
      setError(`Erro ao filtrar RNCs: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, selectedType, selectedDepartment, searchTerm]);

  return { filteredRNCs, isLoading, error };
};