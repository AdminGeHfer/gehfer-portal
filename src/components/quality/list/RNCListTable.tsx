import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RNCStatusBadge } from "@/components/molecules/RNCStatusBadge";
import { format } from "date-fns";
import { RNC } from "@/types/rnc";
import { useNavigate } from "react-router-dom";

interface RNCListTableProps {
  rncs: RNC[];
  isLoading: boolean;
}

export const RNCListTable = ({ rncs, isLoading }: RNCListTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[100px]">Número</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead className="text-right">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Carregando...
              </TableCell>
            </TableRow>
          ) : rncs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Nenhuma RNC encontrada
              </TableCell>
            </TableRow>
          ) : (
            rncs.map((rnc) => (
              <TableRow
                key={rnc.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/quality/rnc/${rnc.id}`)}
              >
                <TableCell className="font-medium">#{rnc.rnc_number || '-'}</TableCell>
                <TableCell>{rnc.company}</TableCell>
                <TableCell>{rnc.department}</TableCell>
                <TableCell>
                  <RNCStatusBadge status={rnc.workflow_status} />
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    rnc.priority === 'high' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : rnc.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {rnc.priority === 'high' ? 'Alta' : rnc.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {format(new Date(rnc.created_at), "dd/MM/yyyy")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};