export type RNCStatus = "Pendente" | "Cancelado" | "Coletado" | "Solucionado";

export type RNCType =
  | "Reclamação do Cliente"
  | "Fornecedor"
  | "Expedição"
  | "Logística"
  | "Representante"
  | "Motorista"
  | "Financeiro"
  | "Comercial"
  | "Acordo Financeiro";

export type RNCDepartment = "Logística" | "Qualidade" | "Financeiro";

export interface RNCTableData {
  id: string;
  rnc_number: number;
  company_code: string;
  company: string;
  type: string;
  status: string;
  department: string;
  date: string;
  created_at: string;
}