import { WorkflowStatusEnum } from "./rnc";

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

export const getStatusLabel = (status: WorkflowStatusEnum): string => {
  const labels: Record<WorkflowStatusEnum, string> = {
    open: "Aberto",
    analysis: "Em Análise",
    resolution: "Em Resolução",
    solved: "Solucionado",
    closing: "Fechamento Financeiro",
    closed: "Fechado"
  };
  return labels[status] || status;
};