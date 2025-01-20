export type DepartmentEnum = "logistics" | "quality" | "financial";
export type RNCTypeEnum = "company_complaint" | "supplier" | "dispatch" | "logistics" | "deputy" | "driver" | "financial" | "commercial" | "financial_agreement";
export type WorkflowStatusEnum = "open" | "analysis" | "resolution" | "solved" | "closing" | "closed";
export type RNCTypeEnum = "company_complaint" | "supplier" | "dispatch" | "logistics" | "deputy" | "driver" | "financial" | "commercial" | "financial_agreement";

export interface RNC {
  id: string;
  rnc_number: number;
  company_code: string;
  company: string;
  cnpj: string;
  type: RNCTypeEnum;
  description: string;
  responsible: string;
  days_left: number;
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
  products?: RNCProduct[];
  contact: RNCContact;
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: string;
  attachments?: File[];
  timeline: TimelineEvent[];
  title?: string;
  canEdit?: boolean;
}

export interface RNCProduct {
  id?: string;
  rnc_id: string;
  product: string;
  weight: number;
  created_at?: string;
}

export interface RNCFormProduct {
  product: string;
  weight: number;
}

export interface RNCContact {
  name: string;
  phone: string;
  email?: string;
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
  company_code: string;
  company: string;
  cnpj?: string;
  type: RNCTypeEnum;
  description: string;
  korp: string;
  nfd?: string;
  nfv?: string;
  department: DepartmentEnum;
  products?: RNCFormProduct[];
  contact: RNCContact;
  attachments?: File[];
  conclusion?: string;
  workflow_status: WorkflowStatusEnum;
  assignedTo?: string;
}