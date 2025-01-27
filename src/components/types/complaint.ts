export interface Complaint {
  id: string;
  date: string;
  company: string;
  status: string;
  description: string;
  protocol: string;
  daysOpen: number;
  rootCause: string;
  solution: string;
  type: string;
  department: string;
  workflow_status: string;
  rnc_number: number;
  company_code: string;
  cnpj: string;
  responsible?: string;
  korp?: string;
  nfv?: string;
  nfd?: string;
  city?: string;
  conclusion?: string;
  events?: any[];
  workflow_transitions?: any[];
  attachments?: any[];
}