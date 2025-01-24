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
import { RNCTableData } from "../types";
import { getStatusColor, getTypeColor, getDepartmentColor } from "../utils/colors";

interface RNCTableProps {
  data: RNCTableData[];
}

export const RNCTable = ({ data }: RNCTableProps) => {
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
            <TableRow key={index}>
              <TableCell className="font-medium text-center">{rnc.number}</TableCell>
              <TableCell className="text-center">{rnc.company}</TableCell>
              <TableCell className="text-center">
                <Badge className={getTypeColor(rnc.type)}>{rnc.type}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge className={getDepartmentColor(rnc.department)}>
                  {rnc.department}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge className={getStatusColor(rnc.status)}>
                  {rnc.status}
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