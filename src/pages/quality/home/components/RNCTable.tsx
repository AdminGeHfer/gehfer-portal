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
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  if (isLoading || !rncs) {
    return <div>Carregando RNCs...</div>;
  }

  const handleRowClick = (rnc: RNCWithRelations) => {
    if (!rnc?.id) return;
    onSelectRNC(rnc.id);
    setTimeout(() => {
      navigate(`/quality/rnc/${rnc.id}`);
    }, 0);
  };

  return (
    <div className="rounded-md border bg-white dark:bg-gray-800">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900">
            <TableRow>
              <TableHead className="font-semibold text-center">Número</TableHead>
              <TableHead className="font-semibold text-center">Empresa</TableHead>
              <TableHead className="font-semibold text-center">Tipo</TableHead>
              <TableHead className="font-semibold text-center">Departamento</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="font-semibold text-center">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rncs.map((rnc) => (
              <TableRow 
                key={rnc.id}
                className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => handleRowClick(rnc)}
              >
                <TableCell className="text-center">{rnc.rnc_number}</TableCell>
                <TableCell className="text-center">{rnc.company}</TableCell>
                <TableCell className="text-center">
                  <Badge className={getTypeColor(getTypeDisplayName(rnc.type))}>
                    {getTypeDisplayName(rnc.type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={getDepartmentColor(getDepartmentDisplayName(rnc.department))}>
                    {getDepartmentDisplayName(rnc.department)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={getStatusColor(getStatusDisplayName(rnc.status))}>
                    {getStatusDisplayName(rnc.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
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