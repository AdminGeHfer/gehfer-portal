export type DepartmentEnum = "Expedição" | "Logistica" | "Comercial" | "Qualidade" | "Produção";
export type WorkflowStatusEnum = "open" | "analysis" | "resolution" | "solved" | "closing" | "closed";
export type UserRole = "admin" | "manager" | "analyst" | "user";

export interface RNCContact {
  name: string;
  phone?: string;
  email?: string;
}

export interface RNC {
  id: string;
  description: string;
  workflow_status: WorkflowStatusEnum;
  priority: "low" | "medium" | "high";
  type: "client" | "supplier";
  department: DepartmentEnum;
  contact: RNCContact;
  company: string;
  cnpj: string;
  orderNumber?: string;
  returnNumber?: string;
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: string;
  attachments?: File[];
  resolution?: string;
  rnc_number?: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface RNCFormData {
  description: string;
  priority: "low" | "medium" | "high";
  type: "client" | "supplier";
  department: DepartmentEnum;
  contact: RNCContact;
  company: string;
  cnpj: string;
  orderNumber?: string;
  returnNumber?: string;
  workflow_status?: WorkflowStatusEnum;
  assignedTo?: string;
  attachments?: File[];
  resolution?: string;
}

export const getStatusLabel = (status: WorkflowStatusEnum): string => {
  const labels: Record<WorkflowStatusEnum, string> = {
    open: "Aberto",
    analysis: "Em Análise",
    resolution: "Em Resolução", 
    solved: "Solucionado",
    closing: "Em Fechamento",
    closed: "Encerrado"
  };
  return labels[status] || status;
};