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
  rnc_number?: number;
  assigned_by?: string;
  assigned_at?: string;
  workflow_status: WorkflowStatusEnum;
  timeline?: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    type: string;
  }>;
}

export enum WorkflowStatusEnum {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved'
}

export enum DepartmentEnum {
  QUALITY = 'quality',
  PRODUCTION = 'production',
  LOGISTICS = 'logistics'
}