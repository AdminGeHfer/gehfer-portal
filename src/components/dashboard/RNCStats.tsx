import { CompanyQualityStats, DepartmentQualityStats, ResponsibleQualityStats, TypeQualityStats } from '@/hooks/useDashboardStats';
import * as React from 'react';

interface RNCStatsProps {
  stats: {
    totalRNCs: number;
    pendingRNCs: number;
    canceledRNCs: number;
    collectedRNCs: number;
    concludedRNCs: number;
    typeStats: TypeQualityStats[];
    departmentStats: DepartmentQualityStats[];
    responsibleStats: ResponsibleQualityStats[];
    companyStats: CompanyQualityStats[];
  } | null;
  isLoading: boolean;
}

export function RNCStats({ stats, isLoading }: RNCStatsProps) {
  if (isLoading) {
    return <div>Carregando estatísticas...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
      <div className="bg-slate-100 dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-400">Total (mês)</h3>
        <p className="text-2xl font-bold text-slate-600 dark:text-slate-300">{stats.totalRNCs}</p>
      </div>
      <div className="bg-yellow-100 dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-yellow-700  dark:text-yellow-500">Pendentes</h3>
        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingRNCs}</p>
      </div>
      <div className="bg-blue-100 dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-blue-700  dark:text-blue-500">Coletadas</h3>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.collectedRNCs}</p>
      </div>
      <div className="bg-green-100 dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-green-700 dark:text-green-500">Solucionadas</h3>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.concludedRNCs}</p>
      </div>
      <div className="bg-red-100 dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-500">Canceladas</h3>
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.canceledRNCs}</p>
      </div>
    </div>
  );
}
