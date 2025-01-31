import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { RNCWithRelations } from "@/types/rnc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RNCTableProps {
  rncs: RNCWithRelations[];
  onEdit: (rnc: RNCWithRelations) => void;
  onDelete: (rnc: RNCWithRelations) => void;
  isLoading: boolean;
}

export function RNCTable({ rncs, onEdit, onDelete, isLoading }: RNCTableProps) {
  if (isLoading || !rncs) {
    return <div>Carregando RNCs...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rncs.map((rnc) => (
            <TableRow key={rnc.id}>
              <TableCell>{rnc.rnc_number}</TableCell>
              <TableCell>
                {format(new Date(rnc.created_at), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>{rnc.company}</TableCell>
              <TableCell>{rnc.status}</TableCell>
              <TableCell>{rnc.type}</TableCell>
              <TableCell>{rnc.department}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(rnc)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(rnc)}
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
  );
}
