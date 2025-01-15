import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RNCWorkflowTimelineProps {
  rncId: string;
}

export function RNCWorkflowTimeline({ rncId }: RNCWorkflowTimelineProps) {
  const { data: transitions, isLoading } = useQuery({
    queryKey: ['rnc-workflow-transitions', rncId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rnc_workflow_transitions')
        .select(`
          *,
          created_by_profile:profiles(name)
        `)
        .eq('rnc_id', rncId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: "Aberto",
      analysis: "Em Análise",
      resolution: "Em Resolução",
      solved: "Solucionado",
      closing: "Em Fechamento",
      closed: "Encerrado"
    };
    return labels[status] || status;
  };

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  if (isLoading) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Histórico do Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  if (!transitions?.length) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Histórico do Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Nenhuma transição registrada
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Histórico do Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transitions.map((transition) => (
            <div
              key={transition.id}
              className="flex gap-4 p-4 rounded-lg bg-muted/50"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {getInitials(transition.created_by_profile?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {transition.created_by_profile?.name}
                  </p>
                  <time className="text-xs text-muted-foreground">
                    {format(new Date(transition.created_at), "dd/MM/yyyy HH:mm", {
                      locale: ptBR,
                    })}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground">
                  Alterou o status de{" "}
                  <span className="font-medium">
                    {getStatusLabel(transition.from_status)}
                  </span>{" "}
                  para{" "}
                  <span className="font-medium">
                    {getStatusLabel(transition.to_status)}
                  </span>
                </p>
                {transition.notes && (
                  <p className="text-sm mt-2 p-2 bg-muted rounded">
                    {transition.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}