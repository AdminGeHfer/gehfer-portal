export type DepartmentEnum = "Expedição" | "Logistica" | "Comercial" | "Qualidade" | "Produção";
export type WorkflowStatusEnum = "open" | "analysis" | "resolution" | "solved" | "closing" | "closed";
export type RNCTypeEnum = "company_complaint" | "supplier" | "dispatch" | "logistics" | "deputy" | "driver" | "financial" | "commercial" | "financial_agreement";

export interface RNC {
  id: string;
  description: string;
  workflow_status: WorkflowStatusEnum;
  priority: "low" | "medium" | "high";
  type: RNCTypeEnum;
  department: DepartmentEnum;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  company: string;
  cnpj: string;
  order_number?: string;
  return_number?: string;
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: string;
  products?: RNCProduct[];
  attachments?: File[];
  timeline: TimelineEvent[];
  resolution?: string;
  rnc_number?: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  title?: string;
  canEdit?: boolean;
}

export interface RNCProduct {
  name: string;
  weight: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "creation" | "update" | "status" | "comment" | "assignment";
  userId: string;
  comment?: string;
}

export interface RNCFormData {
  id?: string;
  description: string;
  priority: "low" | "medium" | "high";
  type: RNCTypeEnum;
  department: DepartmentEnum;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  company: string;
  cnpj: string;
  order_number?: string;
  return_number?: string;
  workflow_status: WorkflowStatusEnum;
  assignedTo?: string;
  products?: RNCProduct[];
  attachments?: File[];
  resolution?: string;
}