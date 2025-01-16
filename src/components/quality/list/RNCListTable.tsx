import * as React from "react";
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
            <TableHead className="w-[100px] font-medium text-center">Número</TableHead>
            <TableHead className="font-medium text-center">Empresa</TableHead>
            <TableHead className="w-[150px] font-medium text-center">Departamento</TableHead>
            <TableHead className="w-[150px] font-medium text-center">Status</TableHead>
            <TableHead className="w-[120px] font-medium text-center">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rncs.map((rnc) => (
            <TableRow
              key={rnc.id}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
              onClick={() => onRowClick(rnc.id)}
            >
              <TableCell className="font-medium text-center">#{rnc.rnc_number}</TableCell>
              <TableCell className="max-w-[300px] truncate text-center">{rnc.company}</TableCell>
              <TableCell className="text-center">{rnc.department}</TableCell>
              <TableCell className="text-center">
                <RNCStatusBadge status={rnc.workflow_status} />
              </TableCell>
              <TableCell className="text-center">
                {format(new Date(rnc.created_at), "dd/MM/yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};