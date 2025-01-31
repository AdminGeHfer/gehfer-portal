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
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
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
  onEdit: (rnc: RNCWithRelations) => void;
  onDelete: (rnc: RNCWithRelations) => void;
  isLoading: boolean;
}

export function RNCTable({ rncs, onEdit, onDelete, isLoading }: RNCTableProps) {
  const navigate = useNavigate();

  if (isLoading || !rncs) {
    return <div>Carregando RNCs...</div>;
  }

  const handleRowClick = (id: string) => {
    navigate(`/quality/rnc/${id}`);
  };

  return (
    <div className="rounded-md border bg-white dark:bg-gray-800 overflow-hidden">
      <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900">
            <TableRow>
              <TableHead className="font-semibold">Número</TableHead>
              <TableHead className="font-semibold">Data</TableHead>
              <TableHead className="font-semibold">Empresa</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Tipo</TableHead>
              <TableHead className="font-semibold">Departamento</TableHead>
              <TableHead className="font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rncs.map((rnc) => (
              <TableRow 
                key={rnc.id}
                className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => handleRowClick(rnc.id)}
              >
                <TableCell>{rnc.rnc_number}</TableCell>
                <TableCell>
                  {new Date(rnc.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>{rnc.company}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(getStatusDisplayName(rnc.status))}>
                    {getStatusDisplayName(rnc.status)}
                  </Badge>
                </TableCell>
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
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(rnc);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(rnc);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
