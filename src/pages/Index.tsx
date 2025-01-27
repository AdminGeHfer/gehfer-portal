import { useState } from "react";
import * as React from "react";
import { ComplaintFilters } from "@/components/dashboard/ComplaintFilters";
import { ComplaintDetails } from "@/components/dashboard/ComplaintDetails";
import { ComplaintStats } from "@/components/dashboard/ComplaintStats";
import { ComplaintTable } from "@/components/dashboard/ComplaintTable";
import { CreateRNCModal } from "@/components/rnc/CreateRNCModal";
import { useRNCData } from "@/hooks/useRNCData";

const Index = () => {
  const { rncs, isLoadingRNCs } = useRNCData();
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
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

  const filteredComplaints = React.useMemo(() => {
    if (!rncs) return [];

    return rncs.filter((complaint) => {
      const searchTerms = {
        protocol: filters.protocol.toLowerCase(),
        date: filters.date.toLowerCase(),
        company: filters.company.toLowerCase(),
      };

      if (!Object.values(searchTerms).some(term => term !== "")) {
        return true;
      }

      const matchesProtocol = !searchTerms.protocol || complaint.rnc_number.toString().toLowerCase().includes(searchTerms.protocol);
      const matchesDate = !searchTerms.date || complaint.created_at.toLowerCase().includes(searchTerms.date);
      const matchesCompany = !searchTerms.company || complaint.company.toLowerCase().includes(searchTerms.company);

      return matchesProtocol || matchesDate || matchesCompany;
    });
  }, [rncs, filters]);

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="glass-card p-8 animate-scale-in dark:bg-gray-800/50">
          <div className="mb-8">
            <ComplaintStats complaints={filteredComplaints} />
          </div>

          <ComplaintFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onCreateRNC={() => setIsCreateModalOpen(true)}
          />
          
          <ComplaintTable 
            complaints={filteredComplaints} 
            onSelectComplaint={setSelectedComplaint}
            isLoading={isLoadingRNCs}
          />

          {selectedComplaint && (
            <ComplaintDetails
              complaint={rncs?.find((c) => c.id === selectedComplaint)!}
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