import { useState } from "react";
import { Complaint } from "@/types/complaint";

interface ComplaintFilters {
  protocol: string;
  date: string;
  company: string;
  status: string;
  daysOpen: string;
}

export const useComplaintFilters = (complaints: Complaint[]) => {
  const [filters, setFilters] = useState<ComplaintFilters>({
    protocol: "",
    date: "",
    company: "",
    status: "",
    daysOpen: "",
  });

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

  return {
    filters,
    handleFilterChange,
    filteredComplaints,
  };
};