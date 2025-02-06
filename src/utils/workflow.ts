import { WorkflowStatusEnum } from "@/types/rnc";

export const getWorkflowStatusLabel = (status: WorkflowStatusEnum): string => {
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