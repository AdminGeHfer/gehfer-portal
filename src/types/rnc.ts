export enum RncDepartmentEnum {
  logistics = "logistics",
  quality = "quality", 
  financial = "financial",
  tax = "tax"
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

export enum RncStatusEnum {
  not_created = "not_created",
  pending = "pending",
  collect = "collect",
  concluded = "concluded",
  canceled = "canceled"
}

export enum WorkflowStatusEnum {
  open = "open",
  analysis = "analysis",
  resolution = "resolution",
  solved = "solved",
  closing = "closing",
  closed = "closed"
}

// Base RNC interface matching Supabase schema
export interface RNC {
  id: string;
  rnc_number?: number;
  company_code?: string;
  company: string;
  document?: string;
  type: RncTypeEnum;
  department: RncDepartmentEnum;
  responsible: string;
  description: string;
  resolution?: string;
  korp: string;
  nfv: string;
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
  assigned_by: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface BaseRNCContact {
  name?: string;
  phone?: string;
  email?: string;
}

export interface BaseRNCProduct {
  name: string;
  weight: number;
}

// Creation interfaces
export interface CreateRNCProduct extends BaseRNCProduct {
  id?: string
}

export interface CreateRNCContact extends BaseRNCContact {
  id?: string;
}

// Attachment interface
export interface RNCAttachment {
  id: string;
  rnc_id: string;
  filename: string;
  filesize: number;
  content_type: string;
  file_path: string;
  created_by: string;
  created_at: string;
}


export interface RNCEvent {
  id: string;
  rnc_id: string;
  title: string;
  description: string;
  type: string;
  created_at: string;
  created_by: string;
  created_by_profile?: {
    name: string;
  };
}

export interface WorkflowTransition {
  id: string;
  rnc_id: string;
  from_status: WorkflowStatusEnum | null;
  to_status: WorkflowStatusEnum;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  created_by_profile: {
    name: string;
  };
}

export interface RNCBaseInput {
  company_code?: string;
  company: string;
  document?: string;
  type: RncTypeEnum;
  department: RncDepartmentEnum;
  responsible: string;
  description: string;
  resolution?: string;
  korp: string;
  nfv: string;
  nfd?: string;
  city?: string;
  collected_at?: string | null;
  closed_at?: string | null;
  conclusion?: string | null;
  products: (CreateRNCProduct | RNCProduct)[];
  contacts: (CreateRNCContact | RNCContact)[];
  attachments?: (File | RNCAttachment)[];
}

// Contact interface
export interface RNCContact extends BaseRNCContact {
  id: string;
  rnc_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Product interface
export interface RNCProduct extends BaseRNCProduct {
  id: string;
  rnc_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Update the RNCWithRelations interface
export interface RNCWithRelations extends RNC {
  attachments?: RNCAttachment[];
  contacts: RNCContact[];
  products: RNCProduct[];
  events: RNCEvent[];
  workflow_transitions: WorkflowTransition[];
  created_by_profile?: {
    name: string;
  };
  assigned_by_profile?: {
    name: string;
  };
  assigned_to_profile?: {
    name: string;
  };
}

// Creation input type
export interface CreateRNCInput extends RNCBaseInput {
  status?: RncStatusEnum;
  workflow_status?: WorkflowStatusEnum;
  assigned_by?: string;
  assigned_to?: string;
  created_by: string;
  created_at: string;
}

export interface UpdateRNCInput extends Partial<RNCBaseInput> {
  status?: RncStatusEnum;
  workflow_status?: WorkflowStatusEnum;
  updated_at: string;
}
