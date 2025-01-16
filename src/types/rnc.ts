export type DepartmentEnum = "logistics" | "quality" | "financial";
export type RNCTypeEnum = "company_complaint" | "supplier" | "dispatch" | "logistics" | "deputy" | "driver" | "financial" | "commercial" | "financial_agreement";
export type WorkflowStatusEnum = "open" | "analysis" | "resolution" | "solved" | "closing" | "closed";

export interface RNC {
  id: string;
  rnc_number: number;
  company_code: string;
  company: string;
  cnpj: string;
  type: RNCTypeEnum;
  product: string;
  description: string;
  responsible: string;
  days_left: number;
  weight: number;
  korp: string;
  nfv: string;
  nfd: string;
  collected_at?: string;
  closed_at?: string;
  city: string;
  conclusion: string;
  department: DepartmentEnum;
  assigned_at?: string;
  workflow_status: WorkflowStatusEnum;
  assigned_to?: string;
  assigned_by?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: string;
  attachments?: File[];
  timeline: TimelineEvent[];
  title?: string;
  canEdit?: boolean;
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
  company: string;
  cnpj?: string;
  korp: string;
  nfd?: string;
  description: string;
  department: DepartmentEnum;
  type: RNCTypeEnum;
  attachments?: File[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  workflow_status: WorkflowStatusEnum;
  assignedTo?: string;
  resolution?: string;
}