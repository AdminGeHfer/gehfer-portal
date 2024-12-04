import { WorkflowStatusEnum } from "./rnc";

export interface WorkflowTransition {
  id: string;
  rnc_id: string;
  from_status: WorkflowStatusEnum;
  to_status: WorkflowStatusEnum;
  notes?: string;
  created_by: string;
  created_at: string;
  created_by_profile?: {
    name: string;
  };
}

export const getStatusLabel = (status: WorkflowStatusEnum): string => {
  const labels: Record<string, string> = {
    open: "Aberto",
    analysis: "Em Análise",
    resolution: "Em Resolução",
    solved: "Solucionado",
    closing: "Em Fechamento",
    closed: "Encerrado"
  };
  return labels[status] || status;
};