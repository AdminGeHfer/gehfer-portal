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
import { Complaint } from "@/types/complaint";

interface ComplaintTableProps {
  complaints: Complaint[];
  onSelectComplaint: (id: number) => void;
}

export const ComplaintTable = ({ complaints, onSelectComplaint }: ComplaintTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (complaintId: number) => {
    navigate(`/quality/rnc/${complaintId}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200/50 dark:border-gray-700/50">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
            <TableHead className="font-medium dark:text-gray-300">Protocolo</TableHead>
            <TableHead className="font-medium dark:text-gray-300">Data</TableHead>
            <TableHead className="font-medium dark:text-gray-300">Empresa</TableHead>
            <TableHead className="font-medium dark:text-gray-300">Status</TableHead>
            <TableHead className="font-medium dark:text-gray-300">Dias em Aberto</TableHead>
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
              <TableCell className="font-medium dark:text-gray-200">{complaint.protocol}</TableCell>
              <TableCell className="dark:text-gray-200">
                {new Date(complaint.date).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell className="dark:text-gray-200">{complaint.company}</TableCell>
              <TableCell>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    complaint.status === "Em análise"
                      ? "bg-warning/10 text-warning-dark dark:bg-warning/20"
                      : "bg-error/10 text-error-dark dark:bg-error/20"
                  }`}
                >
                  {complaint.status}
                </span>
              </TableCell>
              <TableCell className="dark:text-gray-200">{complaint.daysOpen} dias</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};