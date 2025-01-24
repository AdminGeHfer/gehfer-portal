import { useState } from "react";
import * as React from "react";
import { toast } from "sonner";
import { ComplaintFilters } from "@/components/dashboard/ComplaintFilters";
import { ComplaintDetails } from "@/components/dashboard/ComplaintDetails";
import { ComplaintStats } from "@/components/dashboard/ComplaintStats";
import { ComplaintTable } from "@/components/dashboard/ComplaintTable";
import { CreateRNCModal } from "@/components/rnc/CreateRNCModal";

const Index = () => {
  const [complaints] = useState([
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
  const [filters, setFilters] = useState({
    protocol: "",
    date: "",
    company: "",
    status: "",
    daysOpen: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const searchTerms = {
      protocol: filters.protocol.toLowerCase(),
      date: filters.date.toLowerCase(),
      company: filters.company.toLowerCase(),
    };

    if (!Object.values(searchTerms).some(term => term !== "")) {
      return true;
    }

    const matchesProtocol = !searchTerms.protocol || complaint.protocol.toLowerCase().includes(searchTerms.protocol);
    const matchesDate = !searchTerms.date || complaint.date.toLowerCase().includes(searchTerms.date);
    const matchesCompany = !searchTerms.company || complaint.company.toLowerCase().includes(searchTerms.company);

    return matchesProtocol || matchesDate || matchesCompany;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="glass-card p-8 animate-scale-in dark:bg-gray-800/50">
          <div className="mb-8">
            <ComplaintStats complaints={complaints} />
          </div>

          <ComplaintFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
          />
          
          <ComplaintTable 
            complaints={filteredComplaints} 
            onSelectComplaint={setSelectedComplaint} 
          />

          {selectedComplaint && (
            <ComplaintDetails
              complaint={complaints.find((c) => c.id === selectedComplaint)!}
              onClose={() => setSelectedComplaint(null)}
            />
          )}

          <CreateRNCModal
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;