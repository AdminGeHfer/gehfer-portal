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
  company_complaint = 'company_complaint',
  internal_complaint = 'internal_complaint',
  customer_complaint = 'customer_complaint'
}

export interface RNC {
  id: string;
  description: string;
  type: RncTypeEnum;
  company: string;
  cnpj: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  created_by: string;
  assigned_to?: string;
  rnc_number?: number;
  assigned_by?: string;
  assigned_at?: string;
  workflow_status: WorkflowStatusEnum;
  department: string;
  company_code: string;
  responsible?: string;
  days_left?: number;
  korp?: string;
  nfv?: string;
  nfd?: string;
  collected_at?: string;
  city?: string;
  conclusion?: string;
  status: RncStatusEnum;
}