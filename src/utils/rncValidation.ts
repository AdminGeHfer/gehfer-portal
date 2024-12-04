import { DepartmentEnum, WorkflowStatusEnum } from "@/types/rnc";

export const validateDepartment = (department: string): DepartmentEnum => {
  switch (department) {
    case "Expedição":
      return "Expedição";
    case "Logistica":
      return "Logistica";
    case "Comercial":
      return "Comercial";
    case "Qualidade":
      return "Qualidade";
    case "Produção":
      return "Produção";
    default:
      return "Qualidade";
  }
};

export const validateWorkflowStatus = (status: string): WorkflowStatusEnum => {
  switch (status?.toLowerCase()) {
    case "open":
      return "open";
    case "analysis":
      return "analysis";
    case "resolution":
      return "resolution";
    case "solved":
      return "solved";
    case "closing":
      return "closing";
    case "closed":
      return "closed";
    default:
      return "open";
  }
};

export const validatePriority = (priority: string): "low" | "medium" | "high" => {
  switch (priority?.toLowerCase()) {
    case "low":
      return "low";
    case "medium":
      return "medium";
    case "high":
      return "high";
    default:
      return "medium";
  }
};

export const validateType = (type: string): "client" | "supplier" => {
  switch (type?.toLowerCase()) {
    case "client":
      return "client";
    case "supplier":
      return "supplier";
    default:
      return "client";
  }
};