import { useState } from "react";
import { RNCFilters } from "./components/RNCFilters";
import { RNCTable } from "./components/RNCTable";
import type { RNCTableData } from "./types";

const RNCHome = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Example data
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
    {
      number: "RNC-004",
      company: "Empresa D",
      type: "Expedição",
      status: "Cancelado",
      department: "Qualidade",
      date: "2024-03-12",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Registros de Não Conformidades (RNCs)
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Gerencie as não conformidades cadastradas no portal
      </p>

      <RNCFilters
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchExpanded={isSearchExpanded}
        setIsSearchExpanded={setIsSearchExpanded}
      />

      <RNCTable data={exampleData} />
    </div>
  );
};

export default RNCHome;