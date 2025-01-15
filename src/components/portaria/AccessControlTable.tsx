import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import * as React from "react";
import { ExitConfirmationDialog } from "./ExitConfirmationDialog";
import { AccessHistoryDialog } from "./AccessHistoryDialog";

interface AccessControlTableProps {
  accessLogs: {
    id: string;
    truck: {
      plate: string;
      driver_name: string;
      transport_company: string;
    };
    entry_time: string;
    exit_time: string | null;
    operation_status: string | null;
  }[];
  isLoading: boolean;
  onViewDetails: (log) => void;
}

export function AccessControlTable({ accessLogs = [], isLoading }: AccessControlTableProps) {
  const [selectedLog, setSelectedLog] = useState(null);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

  const getStatusBadge = (exitTime: string | null, operationStatus: string | null) => {
    if (exitTime) {
      return <Badge variant="secondary">Saída Registrada</Badge>;
    }
    if (operationStatus === "completed") {
      return <Badge variant="secondary">Operação Finalizada</Badge>;
    }
    if (operationStatus === "in_process") {
      return <Badge className="bg-blue-500">Em operação</Badge>;
    }
    return <Badge className="bg-green-500">Aguardando</Badge>;
  };

  const handleRegisterExit = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('truck_access_logs')
        .update({ 
          exit_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', logId);

      if (error) throw error;
      
      toast.success("Saída registrada com sucesso!");
      // Force a refresh of the page to update the data
      window.location.reload();
    } catch (error) {
      console.error('Error registering exit:', error);
      toast.error("Erro ao registrar saída");
    }
  };

  const handleExitClick = (log) => {
    setSelectedLog(log);
    setIsExitDialogOpen(true);
  };

  const handleHistoryClick = (log) => {
    setSelectedLog(log);
    setIsHistoryDialogOpen(true);
  };

  const handleConfirmExit = () => {
    if (selectedLog) {
      handleRegisterExit(selectedLog.id);
      setIsExitDialogOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Motorista</TableHead>
              <TableHead>Transportadora</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Saída</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : accessLogs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            ) : (
              accessLogs?.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.truck?.plate}</TableCell>
                  <TableCell>{log.truck?.driver_name}</TableCell>
                  <TableCell>{log.truck?.transport_company}</TableCell>
                  <TableCell>
                    {format(new Date(log.entry_time), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {log.exit_time ? 
                      format(new Date(log.exit_time), "dd/MM/yyyy HH:mm", { locale: ptBR }) 
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(log.exit_time, log.operation_status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleHistoryClick(log)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      {!log.exit_time && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleExitClick(log)}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Registrar Saída
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ExitConfirmationDialog
        open={isExitDialogOpen}
        onOpenChange={setIsExitDialogOpen}
        accessLog={selectedLog}
        onConfirm={handleConfirmExit}
      />

      <AccessHistoryDialog
        open={isHistoryDialogOpen}
        onOpenChange={setIsHistoryDialogOpen}
        accessLog={selectedLog}
      />
    </>
  );
}
