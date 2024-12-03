import { useState, useMemo, useCallback } from "react";
import { RNC } from "@/types/rnc";

interface UseRNCSearchProps {
  rncs: RNC[];
}

export const useRNCSearch = ({ rncs }: UseRNCSearchProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredRNCs = useMemo(() => {
    return rncs.filter((rnc) => {
      const matchesSearch =
        search === "" ||
        rnc.description.toLowerCase().includes(search.toLowerCase()) ||
        rnc.company.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || rnc.workflow_status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || rnc.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [rncs, search, statusFilter, priorityFilter]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
  }, []);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredRNCs,
    clearFilters,
  };
};
