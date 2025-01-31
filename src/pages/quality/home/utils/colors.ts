import { RncDepartmentEnum, RncStatusEnum, RncTypeEnum, WorkflowStatusEnum } from "@/types/rnc";

export const getStatusDisplayName = (status: RncStatusEnum): string => {
  const statusMap = {
    [RncStatusEnum.not_created]: 'Não Criada',
    [RncStatusEnum.pending]: 'Pendente',
    [RncStatusEnum.collect]: 'Coleta',
    [RncStatusEnum.concluded]: 'Concluída',
    [RncStatusEnum.canceled]: 'Cancelada'
  };
  return statusMap[status] || status;
};

export const getTypeDisplayName = (type: RncTypeEnum): string => {
  const typeMap = {
    [RncTypeEnum.company_complaint]: 'Reclamação',
    [RncTypeEnum.supplier]: 'Fornecedor',
    [RncTypeEnum.dispatch]: 'Expedição',
    [RncTypeEnum.logistics]: 'Logística',
    [RncTypeEnum.deputy]: 'Representante',
    [RncTypeEnum.driver]: 'Motorista',
    [RncTypeEnum.financial]: 'Financeiro',
    [RncTypeEnum.commercial]: 'Comercial',
    [RncTypeEnum.financial_agreement]: 'Acordo Financeiro'
  };
  return typeMap[type] || type;
};

export const getDepartmentDisplayName = (department: RncDepartmentEnum): string => {
  const departmentMap = {
    [RncDepartmentEnum.logistics]: 'Logística',
    [RncDepartmentEnum.quality]: 'Qualidade',
    [RncDepartmentEnum.financial]: 'Financeiro',
    [RncDepartmentEnum.tax]: 'Fiscal'
  };
  return departmentMap[department] || department;
};

export const getWorkflowStatusDisplayName = (status: WorkflowStatusEnum) => {
  const workflowStatusMap = {
    [WorkflowStatusEnum.open]: 'Aberto',
    [WorkflowStatusEnum.analysis]: 'Em Análise',
    [WorkflowStatusEnum.resolution]: 'Em Resolução',
    [WorkflowStatusEnum.solved]: 'Resolvido',
    [WorkflowStatusEnum.closing]: 'Fechando',
    [WorkflowStatusEnum.closed]: 'Fechado'
  };
  return workflowStatusMap[status] || status;
};

export const getStatusColor = (status: string) => {
  const colors = {
    "Pendente": "bg-amber-200 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
    "Cancelado": "bg-rose-200 text-rose-700 dark:bg-rose-900 dark:text-rose-200",
    "Coletado": "bg-teal-200 text-teal-700 dark:bg-teal-900 dark:text-teal-200",
    "Solucionado": "bg-emerald-200 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const getTypeColor = (type: string) => {
  const colors = {
    "Reclamação do Cliente": "bg-sky-200 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
    "Fornecedor": "bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    "Expedição": "bg-violet-200 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
    "Logística": "bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "Representante": "bg-lime-200 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
    "Motorista": "bg-fuchsia-200 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200",
    "Financeiro": "bg-pink-200 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    "Comercial": "bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
    "Acordo Financeiro": "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const getDepartmentColor = (department: string) => {
  const colors = {
    "Logística": "bg-orange-200 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    "Qualidade": "bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    "Financeiro": "bg-rose-200 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    "Fiscal": "bg-fuchsia-200 text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-300"
  };
  return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800";
};