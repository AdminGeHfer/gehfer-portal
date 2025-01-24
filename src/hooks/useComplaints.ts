import { useState } from "react";
import { Complaint } from "@/types/complaint";
import { toast } from "sonner";

export const useComplaints = () => {
  const [complaints] = useState<Complaint[]>([
    {
      id: 1,
      date: "2024-03-20",
      company: "Empresa ABC",
      status: "Em análise",
      description: "Problema com entrega do material",
      protocol: "1001",
      daysOpen: 3,
      rootCause: "",
      solution: "",
    },
    {
      id: 2,
      date: "2024-03-19",
      company: "Empresa XYZ",
      status: "Pendente",
      description: "Material com defeito",
      protocol: "1002",
      daysOpen: 4,
      rootCause: "",
      solution: "",
    },
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleStatusUpdate = (complaintId: number, newStatus: string) => {
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