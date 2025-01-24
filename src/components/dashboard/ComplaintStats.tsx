import * as React from "react";
import { Complaint } from "@/types/complaint";

interface ComplaintStatsProps {
  complaints: Complaint[];
}

export const ComplaintStats = ({ complaints }: ComplaintStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="glass-card p-6 text-center dark:bg-gray-700/50">
        <div className="text-3xl font-semibold text-primary mb-2">
          {complaints.length}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
      </div>
      <div className="glass-card p-6 text-center dark:bg-gray-700/50">
        <div className="text-3xl font-semibold text-warning mb-2">2</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Em Análise</div>
      </div>
      <div className="glass-card p-6 text-center dark:bg-gray-700/50">
        <div className="text-3xl font-semibold text-success mb-2">1</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Resolvidas</div>
      </div>
      <div className="glass-card p-6 text-center dark:bg-gray-700/50">
        <div className="text-3xl font-semibold text-error mb-2">1</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Pendentes</div>
      </div>
    </div>
  );
};