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
            <TableHead>Número</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((rnc, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{rnc.number}</TableCell>
              <TableCell>{rnc.company}</TableCell>
              <TableCell>
                <Badge className={getTypeColor(rnc.type)}>{rnc.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(rnc.status)}>
                  {rnc.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getDepartmentColor(rnc.department)}>
                  {rnc.department}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(rnc.date).toLocaleDateString("pt-BR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};