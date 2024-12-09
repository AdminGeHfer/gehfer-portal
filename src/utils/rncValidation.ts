import { DepartmentEnum, WorkflowStatusEnum } from "@/types/rnc";

export const validateDepartment = (department: string): DepartmentEnum => {
  switch (department) {
    case "Expedição":
      return DepartmentEnum.EXPEDITION;
    case "Logistica":
      return DepartmentEnum.LOGISTICS;
    case "Comercial":
      return DepartmentEnum.COMMERCIAL;
    case "Qualidade":
      return DepartmentEnum.QUALITY;
    case "Produção":
      return DepartmentEnum.PRODUCTION;
    default:
      return DepartmentEnum.QUALITY;
  }
};

export const validateWorkflowStatus = (status: string): WorkflowStatusEnum => {
  switch (status?.toLowerCase()) {
    case "open":
      return WorkflowStatusEnum.OPEN;
    case "analysis":
      return WorkflowStatusEnum.ANALYSIS;
    case "resolution":
      return WorkflowStatusEnum.RESOLUTION;
    case "solved":
      return WorkflowStatusEnum.SOLVED;
    case "closing":
      return WorkflowStatusEnum.CLOSING;
    case "closed":
      return WorkflowStatusEnum.CLOSED;
    default:
      return WorkflowStatusEnum.OPEN;
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