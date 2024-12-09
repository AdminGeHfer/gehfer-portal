export enum DepartmentEnum {
  EXPEDITION = "Expedição",
  LOGISTICS = "Logistica",
  COMMERCIAL = "Comercial",
  QUALITY = "Qualidade",
  PRODUCTION = "Produção"
}

export enum WorkflowStatusEnum {
  OPEN = "open",
  ANALYSIS = "analysis",
  RESOLUTION = "resolution",
  SOLVED = "solved",
  CLOSING = "closing",
  CLOSED = "closed"
}

export interface RNCContact {
  name: string;
  phone: string;
  email: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: string;
  userId: string;
  comment?: string;
}

export interface RNC {
  id: string;
  title?: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  type: string;
  department: DepartmentEnum;
  company: string;
  cnpj: string;
  order_number?: string;
  return_number?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  created_by: string;
  assigned_to?: string;
  assigned_by?: string;
  assigned_at?: string;
  workflow_status: WorkflowStatusEnum;
  timeline?: TimelineEvent[];
  contact: RNCContact;
  resolution?: string;
  canEdit?: boolean;
}

export interface RNCFormData {
  description: string;
  priority: 'low' | 'medium' | 'high';
  type: string;
  department: DepartmentEnum;
  contact: RNCContact;
  company: string;
  cnpj: string;
  order_number?: string;
  return_number?: string;
  workflow_status: WorkflowStatusEnum;
  assigned_to?: string;
  attachments?: File[];
  resolution?: string;
}