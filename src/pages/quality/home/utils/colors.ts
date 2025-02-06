import { RncDepartmentEnum, RncStatusEnum, RncTypeEnum, WorkflowStatusEnum } from "@/types/rnc";

export const getStatusDisplayName = (status: RncStatusEnum): string => {
  const statusMap = {
    [RncStatusEnum.not_created]: "Não Criada",
    [RncStatusEnum.pending]: "Pendente",
    [RncStatusEnum.collect]: "Coletado",
    [RncStatusEnum.concluded]: "Solucionado",
    [RncStatusEnum.canceled]: "Cancelado"
  };
  return statusMap[status] || status;
};

export const getTypeDisplayName = (type: RncTypeEnum): string => {
  const typeMap = {
    [RncTypeEnum.company_complaint]: "Cliente",
    [RncTypeEnum.supplier]: "Fornecedor",
    [RncTypeEnum.dispatch]: "Expedição",
    [RncTypeEnum.logistics]: "Logística",
    [RncTypeEnum.commercial]: "Comercial",
  };
  return typeMap[type] || type;
};

export const getDepartmentDisplayName = (department: RncDepartmentEnum): string => {
  const departmentMap = {
    [RncDepartmentEnum.logistics]: "Logística",
    [RncDepartmentEnum.quality]: "Qualidade",
    [RncDepartmentEnum.financial]: "Financeiro",
    [RncDepartmentEnum.tax]: "Fiscal"
  };
  return departmentMap[department] || department;
};

export const getWorkflowStatusDisplayName = (status: WorkflowStatusEnum) => {
  const workflowStatusMap = {
    [WorkflowStatusEnum.open]: "Aberto",
    [WorkflowStatusEnum.analysis]: "Em Análise",
    [WorkflowStatusEnum.resolution]: "Em Resolução",
    [WorkflowStatusEnum.solved]: "Solucionado",
    [WorkflowStatusEnum.closing]: "Fechamento Financeiro",
    [WorkflowStatusEnum.closed]: "Fechado"
  };
  return workflowStatusMap[status] || status;
};

export const getStatusColor = (status: string) => {
  const colors = {
    "Pendente": "bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
    "Cancelado": "bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-200",
    "Coletado": "bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    "Solucionado": "bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-200"
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const getTypeColor = (type: string) => {
  const colors = {
    "Cliente": "bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    "Fornecedor": "bg-cyan-200 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    "Expedição": "bg-violet-200 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
    "Logística": "bg-lime-200 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
    "Comercial": "bg-teal-200 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  };
  return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const getDepartmentColor = (department: string) => {
  const colors = {
    "Logística": "bg-lime-200 text-lime-700 dark:bg-lime-900 dark:text-lime-300",
    "Qualidade": "bg-purple-200 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    "Financeiro": "bg-rose-200 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    "Fiscal": "bg-pink-200 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
  };
  return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800";
};