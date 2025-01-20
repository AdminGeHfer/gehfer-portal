import { DepartmentEnum, WorkflowStatusEnum, RNCTypeEnum } from "@/types/rnc";

export const validateDepartment = (department: string): DepartmentEnum => {
  switch (department?.toLowerCase()) {
    case "logistics":
      return "logistics";
    case "quality":
      return "quality";
    case "financial":
      return "financial";
    default:
      return "quality";
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

export const validateType = (type: string): RNCTypeEnum => {
  switch (type?.toLowerCase()) {
    case "company_complaint":
      return "company_complaint";
    case "supplier":
      return "supplier";
    case "dispatch":
      return "dispatch";
    case "logistics":
      return "logistics";
    case "deputy":
      return "deputy";
    case "driver":
      return "driver";
    case "financial":
      return "financial";
    case "commercial":
      return "commercial";
    case "financial_agreement":
      return "financial_agreement";
    default:
      return "company_complaint";
  }
};