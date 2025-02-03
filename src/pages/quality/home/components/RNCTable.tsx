import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RNCWithRelations } from "@/types/rnc";
import { 
  getStatusColor, 
  getTypeColor, 
  getDepartmentColor,
  getStatusDisplayName,
  getDepartmentDisplayName,
  getTypeDisplayName 
} from "../utils/colors";

interface RNCTableProps {
  rncs: RNCWithRelations[];
  isLoading: boolean;
  onSelectRNC: (id: string) => void;
}

export function RNCTable({ rncs, isLoading, onSelectRNC }: RNCTableProps) {
  if (isLoading || !rncs) {
    return <div>Carregando RNCs...</div>;
  }

  const handleRowClick = (rnc: RNCWithRelations) => {
    if (onSelectRNC) {
      onSelectRNC(rnc.id); // Pass the full RNC object
    }
  };

  return (
    <div className="rounded-md border bg-white dark:bg-gray-800">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900">
            <TableRow>
              <TableHead className="font-semibold">Número</TableHead>
              <TableHead className="font-semibold">Empresa</TableHead>
              <TableHead className="font-semibold">Tipo</TableHead>
              <TableHead className="font-semibold">Departamento</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rncs.map((rnc) => (
              <TableRow 
                key={rnc.id}
                className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => handleRowClick(rnc)}
              >
                <TableCell>{rnc.rnc_number}</TableCell>
                <TableCell>{rnc.company}</TableCell>
                <TableCell>
                  <Badge className={getTypeColor(getTypeDisplayName(rnc.type))}>
                    {getTypeDisplayName(rnc.type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getDepartmentColor(getDepartmentDisplayName(rnc.department))}>
                    {getDepartmentDisplayName(rnc.department)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(getStatusDisplayName(rnc.status))}>
                    {getStatusDisplayName(rnc.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(rnc.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}