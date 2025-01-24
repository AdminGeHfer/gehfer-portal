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
  number: string;
  company: string;
  type: string;
  status: string;
  department: string;
  date: string;
}