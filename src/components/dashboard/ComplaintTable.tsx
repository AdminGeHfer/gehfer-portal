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
import { Button } from "@/components/atoms/Button";
import { Edit, Trash2 } from "lucide-react";
import { RNC } from "@/types/rnc";

interface ComplaintTableProps {
  complaints: RNC[];
  onEdit: (rnc: RNC) => void;
  onDelete: (rnc: RNC) => void;
}

export const ComplaintTable = ({ complaints, onEdit, onDelete }: ComplaintTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (complaintId: string) => {
    navigate(`/quality/rnc/${complaintId}`);
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-gray-200/50 dark:border-gray-700/50 rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
              <TableHead className="font-medium dark:text-gray-300">Protocolo</TableHead>
              <TableHead className="font-medium dark:text-gray-300">Data</TableHead>
              <TableHead className="font-medium dark:text-gray-300">Empresa</TableHead>
              <TableHead className="font-medium dark:text-gray-300">Status</TableHead>
              <TableHead className="font-medium dark:text-gray-300">Dias em Aberto</TableHead>
              <TableHead className="font-medium dark:text-gray-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow
                key={complaint.id}
                className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => handleRowClick(complaint.id)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleRowClick(complaint.id);
                  }
                }}
              >
                <TableCell className="font-medium dark:text-gray-200">{complaint.rnc_number}</TableCell>
                <TableCell className="dark:text-gray-200">
                  {new Date(complaint.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="dark:text-gray-200">{complaint.company}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      complaint.workflow_status === "open"
                        ? "bg-warning/10 text-warning-dark dark:bg-warning/20"
                        : "bg-error/10 text-error-dark dark:bg-error/20"
                    }`}
                  >
                    {complaint.workflow_status}
                  </span>
                </TableCell>
                <TableCell className="dark:text-gray-200">{complaint.days_left} dias</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(complaint);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(complaint);
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
};
