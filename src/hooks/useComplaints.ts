import { useState } from "react";
import { Complaint } from "@/types/complaint";
import { toast } from "sonner";

export const useComplaints = () => {
  const [complaints] = useState<Complaint[]>([
    {
      id: "1",
      date: "2024-03-20",
      company: "Empresa ABC",
      status: "Em análise",
      description: "Problema com entrega do material",
      protocol: "1001",
      daysOpen: 3,
      rootCause: "",
      solution: "",
      type: "company_complaint",
      department: "logistics",
      workflow_status: "open",
      rnc_number: 1001,
      company_code: "ABC123",
      cnpj: "12345678000190"
    },
    {
      id: "2",
      date: "2024-03-19",
      company: "Empresa XYZ",
      status: "Pendente",
      description: "Material com defeito",
      protocol: "1002",
      daysOpen: 4,
      rootCause: "",
      solution: "",
      type: "company_complaint",
      department: "logistics",
      workflow_status: "open",
      rnc_number: 1002,
      company_code: "XYZ123",
      cnpj: "98765432000190"
    },
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleStatusUpdate = (complaintId: string, newStatus: string) => {
    toast.success(`Status atualizado para: ${newStatus}`);
  };

  return {
    complaints,
    selectedComplaint,
    setSelectedComplaint,
    isCreateModalOpen,
    setIsCreateModalOpen,
    handleStatusUpdate,
  };
};