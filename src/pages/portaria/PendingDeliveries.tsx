import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Clock, AlertCircle } from "lucide-react";
import * as React from "react";

const PendingDeliveries = () => {
  const navigate = useNavigate();

  const { data: pendingDeliveries, isLoading } = useQuery({
    queryKey: ["pending-deliveries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("operations")
        .select(`
          *,
          truck:trucks(*),
          tachograph_records(*)
        `)
        .eq("operation_type", "loading")
        .is("exit_time", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const totalPending = pendingDeliveries?.length || 0;
  const withKm = pendingDeliveries?.filter(d => d.tachograph_records?.length > 0).length || 0;
  const withoutKm = totalPending - withKm;

  return (
    <div className="min-h-screen bg-background">
      <Header title="Cargas" />
      
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-card">
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/portaria/filas")}
            >
              Voltar para Filas
            </Button>
          </div>
          <nav className="space-y-1 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate("/portaria/acesso")}
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
            <Button
              variant="secondary"
              className="w-full justify-start"
            >
              Cargas
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Cargas
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Com KM Registrado
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{withKm}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pendentes KM
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{withoutKm}</div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead>Transportadora</TableHead>
                  <TableHead>Data Saída</TableHead>
                  <TableHead>KM Saída</TableHead>
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
                ) : pendingDeliveries?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Nenhuma carga pendente
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingDeliveries?.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.truck.plate}</TableCell>
                      <TableCell>{delivery.truck.driver_name}</TableCell>
                      <TableCell>{delivery.truck.transport_company}</TableCell>
                      <TableCell>
                        {format(new Date(delivery.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {delivery.tachograph_records?.[0]?.mileage || "Não registrado"}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={delivery.tachograph_records?.[0] ? "default" : "destructive"}
                          className="whitespace-nowrap"
                        >
                          {delivery.tachograph_records?.[0] ? "Em Entrega" : "Pendente KM"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/portaria/filas/${delivery.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PendingDeliveries;