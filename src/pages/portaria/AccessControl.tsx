import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as React from "react";
import { RegisterTruckDialog } from "@/components/portaria/RegisterTruckDialog";
import { AccessDetailsDialog } from "@/components/portaria/AccessDetailsDialog";
import { AccessControlMetrics } from "@/components/portaria/AccessControlMetrics";
import { AccessControlTable } from "@/components/portaria/AccessControlTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePortariaRealtime } from "@/hooks/usePortariaRealtime";

const AccessControl = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: accessLogs, isLoading } = useQuery({
    queryKey: ["access-logs"],
    queryFn: async () => {
      // First get all access logs with their trucks
      const { data: logsWithTrucks, error: logsError } = await supabase
        .from("truck_access_logs")
        .select(`
          *,
          truck:trucks(*)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (logsError) throw logsError;

      // Then get operations for these trucks, including completed ones
      const truckIds = logsWithTrucks.map(log => log.truck_id);
      const { data: operations, error: opsError } = await supabase
        .from("operations")
        .select('truck_id, status, exit_time')
        .in('truck_id', truckIds)
        .order('created_at', { ascending: false });

      if (opsError) throw opsError;

      // Map operations status to access logs, considering the most recent operation
      const logsWithStatus = logsWithTrucks.map(log => {
        const truckOperations = operations.filter(op => op.truck_id === log.truck_id);
        const latestOperation = truckOperations[0]; // Operations are already ordered by created_at desc
        
        return {
          ...log,
          operation_status: latestOperation?.status || null,
          operation_completed: latestOperation?.exit_time ? true : false
        };
      });

      return logsWithStatus;
    },
  });

  // Enable real-time updates
  usePortariaRealtime();

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Controle de Acesso" />
      
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-card">
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/apps")}
            >
              Voltar para Apps
            </Button>
          </div>
          <nav className="space-y-1 p-2">
            <Button
              variant="secondary"
              className="w-full justify-start"
            >
              Controle de Acesso
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/portaria/filas")}
            >
              Gestão de Filas
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <AccessControlMetrics accessLogs={accessLogs} />

          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Registro de Acessos</h2>
              <p className="text-muted-foreground">
                Controle de entrada e saída de caminhões
              </p>
            </div>
            
            <Button onClick={() => setIsDialogOpen(true)}>
              Registrar Entrada
            </Button>
          </div>

          <AccessControlTable 
            accessLogs={accessLogs} 
            isLoading={isLoading} 
            onViewDetails={handleViewDetails}
          />

          <RegisterTruckDialog 
            open={isDialogOpen} 
            onOpenChange={setIsDialogOpen} 
          />

          <AccessDetailsDialog
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            accessLog={selectedLog}
          />
        </main>
      </div>
    </div>
  );
};

export default AccessControl;
