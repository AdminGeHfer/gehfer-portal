import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RNCStatusBadge } from "@/components/molecules/RNCStatusBadge";
import { RNC } from "@/types/rnc";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RNCListTableProps {
  rncs: RNC[];
  onRowClick: (id: string) => void;
  isLoading?: boolean;
}

const getDepartmentLabel = (department: string) => {
  const baseClasses = "inline-flex items-center border text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 animate-fade-in font-medium px-3 py-1 rounded-full border-none";
  
  switch (department) {
    case 'logistics':
      return {
        label: "Logística",
        className: cn(baseClasses, "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400")
      };
    case 'quality':
      return {
        label: "Qualidade",
        className: cn(baseClasses, "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400")
      };
    case 'financial':
      return {
        label: "Financeiro",
        className: cn(baseClasses, "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400")
      };
    default:
      return {
        label: department,
        className: cn(baseClasses, "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400")
      };
  }
};

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
          {rncs.map((rnc) => {
            const deptConfig = getDepartmentLabel(rnc.department);
            return (
              <TableRow
                key={rnc.id}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                onClick={() => onRowClick(rnc.id)}
              >
                <TableCell className="font-medium text-center">#{rnc.rnc_number}</TableCell>
                <TableCell className="max-w-[300px] truncate text-center">{rnc.company}</TableCell>
                <TableCell className="text-center">
                  <span className={deptConfig.className}>
                    {deptConfig.label}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <RNCStatusBadge status={rnc.status} />
                </TableCell>
                <TableCell className="text-center">
                  {rnc.assigned_at ? format(new Date(rnc.assigned_at), "dd/MM/yyyy") : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};