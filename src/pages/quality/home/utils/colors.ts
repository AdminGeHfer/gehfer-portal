export const getStatusColor = (status: string) => {
  const colors = {
    Pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    Cancelado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    Coletado: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    Solucionado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  };
  return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const getTypeColor = (type: string) => {
  const colors = {
    "Reclamação do Cliente": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    "Fornecedor": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
    "Expedição": "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100",
    "Logística": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100",
    "Representante": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    "Motorista": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
    "Financeiro": "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100",
    "Comercial": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100",
    "Acordo Financeiro": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  };
  return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

export const getDepartmentColor = (department: string) => {
  const colors = {
    "Logística": "bg-amber-50 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
    "Qualidade": "bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    "Financeiro": "bg-orange-50 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
  };
  return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800";
};