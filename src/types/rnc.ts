export enum WorkflowStatusEnum {
  open = 'open',
  analysis = 'analysis',
  resolution = 'resolution',
  solved = 'solved',
  closing = 'closing',
  closed = 'closed'
}

export enum RncStatusEnum {
  not_created = 'not_created',
  pending = 'pending',
  collect = 'collect',
  concluded = 'concluded',
  canceled = 'canceled'
}

export enum RncTypeEnum {
  company_complaint = "company_complaint",
  supplier = "supplier",
  dispatch = "dispatch",
  logistics = "logistics",
  deputy = "deputy",
  driver = "driver",
  financial = "financial",
  commercial = "commercial",
  financial_agreement = "financial_agreement"
}

export enum RncDepartmentEnum {
  logistics = "logistics",
  quality = "quality",
  financial = "financial"
}

export interface RNC {
  id: string;
  rnc_number?: number;
  company_code: string;
  company: string;
  cnpj: string;
  description: string;
  type: RncTypeEnum;
  department: RncDepartmentEnum;
  responsible?: string;
  korp?: string;
  nfv?: string;
  nfd?: string;
  days_left?: number;
  city?: string;
  conclusion?: string;
  status: RncStatusEnum;
  workflow_status: WorkflowStatusEnum;
  assigned_at?: string;
  closed_at?: string;
  collected_at?: string;
  created_by: string;
  assigned_by?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}