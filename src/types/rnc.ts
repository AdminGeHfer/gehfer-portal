export type DepartmentEnum = "logistics" | "quality" | "financial";

export type RNCTypeEnum = 
  "company_complaint" | 
  "supplier" | 
  "dispatch" | 
  "logistics" | 
  "deputy" | 
  "driver" | 
  "financial" | 
  "commercial" | 
  "financial_agreement";

export type WorkflowStatusEnum = "open" | "analysis" | "resolution" | "solved" | "closing" | "closed";

export interface RNC {
  id: string;
  description: string;
  workflow_status: WorkflowStatusEnum;
  type: RNCTypeEnum;
  department: DepartmentEnum;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  company: string;
  cnpj: string;
  orderNumber?: string;
  returnNumber?: string;
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: string;
  attachments?: File[];
  timeline: TimelineEvent[];
  resolution?: string;
  rnc_number?: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  title?: string;
  canEdit?: boolean;
  conclusion: string;
  company_code: string;
  responsible?: string;
  days_left?: number;
  korp?: string;
  nfv?: string;
  nfd?: string;
  city?: string;
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
  type: RNCTypeEnum;
  department: DepartmentEnum;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  company: string;
  cnpj: string;
  orderNumber?: string;
  returnNumber?: string;
  workflow_status: WorkflowStatusEnum;
  assignedTo?: string;
  attachments?: File[];
  resolution?: string;
  conclusion?: string;
}