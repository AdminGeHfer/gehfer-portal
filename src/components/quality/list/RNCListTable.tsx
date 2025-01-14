import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RNCStatusBadge } from "@/components/molecules/RNCStatusBadge";
import { RNC } from "@/types/rnc";
import { format } from "date-fns";

interface RNCListTableProps {
  rncs: RNC[];
  onRowClick: (id: string) => void;
  isLoading?: boolean;
}

export const RNCListTable = ({ rncs, onRowClick, isLoading }: RNCListTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border animate-fade-in overflow-hidden p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border animate-fade-in overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-700">
            <TableHead className="w-[100px] font-medium">Número</TableHead>
            <TableHead className="font-medium">Empresa</TableHead>
            <TableHead className="w-[150px] font-medium">Departamento</TableHead>
            <TableHead className="w-[150px] font-medium">Status</TableHead>
            <TableHead className="w-[120px] font-medium">Prioridade</TableHead>
            <TableHead className="w-[120px] font-medium text-right">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rncs.map((rnc) => (
            <TableRow
              key={rnc.id}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
              onClick={() => onRowClick(rnc.id)}
            >
              <TableCell className="font-medium">#{rnc.rnc_number}</TableCell>
              <TableCell className="max-w-[300px] truncate">{rnc.company}</TableCell>
              <TableCell>{rnc.department}</TableCell>
              <TableCell>
                <RNCStatusBadge status={rnc.workflow_status} />
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  rnc.priority === "high"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    : rnc.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                }`}>
                  {rnc.priority === "high" ? "Alta" : rnc.priority === "medium" ? "Média" : "Baixa"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {format(new Date(rnc.created_at), "dd/MM/yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};