import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Clock, FileCheck } from "lucide-react";
import * as React from "react";

interface AccessControlMetricsProps {
  accessLogs: { exit_time: string | null; created_at: string }[];
}

export function AccessControlMetrics({ accessLogs = [] }: AccessControlMetricsProps) {
  const trucksInYard = accessLogs?.filter(log => !log.exit_time).length || 0;
  const todayLogs = accessLogs?.filter(log => 
    new Date(log.created_at).toDateString() === new Date().toDateString()
  ).length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Caminhões no Pátio
          </CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{trucksInYard}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tempo Médio no Pátio
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">45 min</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Registros Hoje
          </CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayLogs}</div>
        </CardContent>
      </Card>
    </div>
  );
}