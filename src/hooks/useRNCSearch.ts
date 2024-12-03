import { RNC } from "@/types/rnc";

export function useRNCSearch(
  rncs: RNC[],
  search: string,
  workflowStatus: string,
  priority: string,
  type: string
) {
  return rncs.filter((rnc) => {
    const matchesSearch =
      !search ||
      rnc.description.toLowerCase().includes(search.toLowerCase()) ||
      rnc.company.toLowerCase().includes(search.toLowerCase()) ||
      rnc.cnpj.includes(search) ||
      (rnc.orderNumber && rnc.orderNumber.includes(search)) ||
      (rnc.returnNumber && rnc.returnNumber.includes(search)) ||
      (rnc.rnc_number && rnc.rnc_number.toString().includes(search));

    const matchesStatus =
      workflowStatus === "all" || rnc.workflow_status === workflowStatus;

    const matchesPriority = priority === "all" || rnc.priority === priority;

    const matchesType = type === "all" || rnc.type === type;

    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });
}