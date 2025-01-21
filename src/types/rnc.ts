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

export type StatusEnum = "not_created" | "pending" | "canceled" | "collect" | "concluded";
export type WorkflowStatusEnum = "open" | "analysis" | "resolution" | "solved" | "closing" | "closed";

export interface RNCProduct {
  product: string;
  weight: number;
}

export interface RNCContact {
  name: string;
  phone: string;
  email: string;
}

export interface RNC {
  id: string;
  description: string;
  workflow_status: WorkflowStatusEnum;
  status: StatusEnum;
  type: RNCTypeEnum;
  department: DepartmentEnum;
  contact: RNCContact;
  company: string;
  company_code: string;
  cnpj: string;
  orderNumber?: string;
  returnNumber?: string;
  assigned_to?: string;
  assigned_by?: string;
  assigned_at?: string;
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
  products?: RNCProduct[];
  responsible?: string;
  days_left?: number;
  korp?: string;
  nfv?: string;
  nfd?: string;
  collected_at?: string;
  city?: string;
  created_by?: string;
}

export interface RNCFormData {
  id?: string;
  description: string;
  type: RNCTypeEnum;
  department: DepartmentEnum;
  contact: RNCContact;
  company: string;
  company_code: string;
  cnpj: string;
  orderNumber?: string;
  returnNumber?: string;
  workflow_status: WorkflowStatusEnum;
  assigned_to?: string;
  attachments?: File[];
  resolution?: string;
  conclusion?: string;
  products?: RNCProduct[];
  korp?: string;
  nfv?: string;
  nfd?: string;
  responsible?: string;
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