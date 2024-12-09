import { WorkflowStatusEnum } from "@/types/rnc";

export const getWorkflowStatusLabel = (status: WorkflowStatusEnum): string => {
  const labels: Record<WorkflowStatusEnum, string> = {
    [WorkflowStatusEnum.OPEN]: "Aberto",
    [WorkflowStatusEnum.ANALYSIS]: "Em Análise",
    [WorkflowStatusEnum.RESOLUTION]: "Em Resolução",
    [WorkflowStatusEnum.SOLVED]: "Solucionado",
    [WorkflowStatusEnum.CLOSING]: "Em Fechamento",
    [WorkflowStatusEnum.CLOSED]: "Encerrado"
  };
  return labels[status] || status;
};