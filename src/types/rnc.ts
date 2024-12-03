export type DepartmentEnum = "Expedição" | "Logistica" | "Comercial" | "Qualidade" | "Produção";

export const WorkflowStatusEnum = {
  OPEN: "open",
  ANALYSIS: "analysis",
  RESOLUTION: "resolution",
  SOLVED: "solved",
  CLOSING: "closing",
  CLOSED: "closed"
} as const;

export type WorkflowStatusEnum = typeof WorkflowStatusEnum[keyof typeof WorkflowStatusEnum];

export interface RNC {
  id: string;
  description: string;
  workflow_status: WorkflowStatusEnum;
  priority: "low" | "medium" | "high";
  type: "client" | "supplier";
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
  resolution?: string;
  rnc_number?: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  timeline: TimelineEvent[];
  title?: string;
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
  type: "client" | "supplier";
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
  attachments?: File[];
  resolution?: string;
  workflow_status: WorkflowStatusEnum;
}