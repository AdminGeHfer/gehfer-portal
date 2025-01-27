import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RNCTableData } from "../types";
import { getStatusColor, getTypeColor, getDepartmentColor, getStatusDisplayName, getDepartmentDisplayName, getTypeDisplayName } from "../utils/colors";

interface RNCTableProps {
  data: RNCTableData[];
}

export const RNCTable = ({ data }: RNCTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (number: string) => {
    navigate(`/quality/rnc/${number}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Número</TableHead>
            <TableHead className="text-center">Empresa</TableHead>
            <TableHead className="text-center">Tipo</TableHead>
            <TableHead className="text-center">Departamento</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((rnc, index) => (
            <TableRow 
              key={index}
              className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={() => handleRowClick(rnc.number)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleRowClick(rnc.number);
                }
              }}
            >
              <TableCell className="font-medium text-center">{rnc.number}</TableCell>
              <TableCell className="text-center">{rnc.company}</TableCell>
              <TableCell className="text-center">
                <Badge className={getTypeColor(getTypeDisplayName(rnc.type))}>{getTypeDisplayName(rnc.type)}</Badge>
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
                {new Date(rnc.date).toLocaleDateString("pt-BR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};