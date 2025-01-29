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
import { getStatusColor, getTypeColor, getDepartmentColor, getStatusDisplayName, getDepartmentDisplayName, getTypeDisplayName } from "../utils/colors";
import { useRNCList } from "@/hooks/useRNCList";
import { useRNCRealtime } from "@/hooks/useRNCRealtime";

interface RNCTableProps {
  data: Array<{
    id: string;
    rnc_number?: number;
    company: string;
    type: string;
    department: string;
    status: string;
    created_at: string;
    collected_at?: string;
    closed_at?: string;
    assigned_at?: string;
  }>;
}

export const RNCTable: React.FC<RNCTableProps> = ({ data }) => {
  const navigate = useNavigate();
  const { loading, refetch } = useRNCList();
  const rncs = data;

  useRNCRealtime(refetch);

  const handleRowClick = (id: string) => {
    navigate(`/quality/rnc/${id}`);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

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
          {rncs.map((rnc) => (
            <TableRow 
              key={rnc.id}
              className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={() => handleRowClick(rnc.id)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleRowClick(rnc.id);
                }
              }}
            >
              <TableCell className="font-medium text-center">{rnc.rnc_number}</TableCell>
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
                {rnc.status === "collect" ? new Date(rnc.collected_at).toLocaleDateString("pt-BR") : rnc.status === "pending" ? new Date(rnc.assigned_at).toLocaleDateString("pt-BR") : rnc.status === "concluded" ? new Date(rnc.closed_at).toLocaleDateString("pt-BR") : new Date(rnc.created_at).toLocaleDateString("pt-BR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};