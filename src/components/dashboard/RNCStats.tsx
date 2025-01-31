import * as React from 'react';
import { RNCWithRelations } from "@/types/rnc";

interface RNCStatsProps {
  rncs: RNCWithRelations[];
  isLoading: boolean;
}

export function RNCStats({ rncs, isLoading }: RNCStatsProps) {
  if (isLoading) {
    return <div>Carregando estatísticas...</div>;
  }

  const totalRNCs = rncs.length;
  const pendingRNCs = rncs.filter(rnc => rnc.status === 'pending').length;
  const concludedRNCs = rncs.filter(rnc => rnc.status === 'concluded').length;
  const canceledRNCs = rncs.filter(rnc => rnc.status === 'canceled').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total RNCs</h3>
        <p className="text-2xl font-bold">{totalRNCs}</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-yellow-700">Pendentes</h3>
        <p className="text-2xl font-bold text-yellow-600">{pendingRNCs}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-green-700">Concluídas</h3>
        <p className="text-2xl font-bold text-green-600">{concludedRNCs}</p>
      </div>
      <div className="bg-red-50 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-red-700">Canceladas</h3>
        <p className="text-2xl font-bold text-red-600">{canceledRNCs}</p>
      </div>
    </div>
  );
}
