import { useState, useMemo, useCallback } from "react";
import { RNC, WorkflowStatusEnum } from "@/types/rnc";

interface UseRNCSearchProps {
  rncs: RNC[];
}

export const useRNCSearch = ({ rncs }: UseRNCSearchProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkflowStatusEnum | "all">("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const filteredRNCs = useMemo(() => {
    return rncs.filter((rnc) => {
      const matchesSearch =
        search === "" ||
        rnc.description.toLowerCase().includes(search.toLowerCase()) ||
        rnc.company.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || rnc.workflow_status === statusFilter;

      const matchesDepartment =
        departmentFilter === "all" || rnc.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [rncs, search, statusFilter, departmentFilter]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("all");
    setDepartmentFilter("all");
  }, []);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    filteredRNCs,
    clearFilters,
  };
};