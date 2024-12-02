import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WorkflowStatusEnum } from "@/types/rnc";

interface RNCWorkflowStatusProps {
  rncId: string;
  currentStatus: WorkflowStatusEnum;
  onStatusChange: () => void;
}

const workflowConfig = {
  open: {
    label: "Aberto",
    nextStatus: "analysis" as WorkflowStatusEnum,
    nextLabel: "Iniciar Análise",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
  },
  analysis: {
    label: "Em Análise",
    nextStatus: "resolution" as WorkflowStatusEnum,
    nextLabel: "Iniciar Resolução",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
  },
  resolution: {
    label: "Em Resolução",
    nextStatus: "solved" as WorkflowStatusEnum,
    nextLabel: "Marcar como Solucionado",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
  },
  solved: {
    label: "Solucionado",
    nextStatus: "closing" as WorkflowStatusEnum,
    nextLabel: "Iniciar Fechamento",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
  },
  closing: {
    label: "Em Fechamento",
    nextStatus: "closed" as WorkflowStatusEnum,
    nextLabel: "Encerrar RNC",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
  },
  closed: {
    label: "Encerrado",
    nextStatus: null,
    nextLabel: null,
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
  }
} as const;

export function RNCWorkflowStatus({ rncId, currentStatus, onStatusChange }: RNCWorkflowStatusProps) {
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const config = workflowConfig[currentStatus];

  const handleStatusChange = async () => {
    if (!config.nextStatus) return;
    
    setIsUpdating(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("Usuário não autenticado");
      }

      // First update the RNC status
      const { error: rncError } = await supabase
        .from('rncs')
        .update({ workflow_status: config.nextStatus })
        .eq('id', rncId);

      if (rncError) throw rncError;

      // Then create the transition record
      const { error: transitionError } = await supabase
        .from('rnc_workflow_transitions')
        .insert({
          rnc_id: rncId,
          from_status: currentStatus,
          to_status: config.nextStatus,
          notes: notes.trim() || null,
          created_by: userData.user.id
        });

      if (transitionError) throw transitionError;

      toast.success("Status atualizado com sucesso");
      setNotes("");
      onStatusChange();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error("Erro ao atualizar status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Workflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={config.className}>
            {config.label}
          </Badge>
        </div>

        {config.nextStatus && (
          <>
            <Textarea
              placeholder="Notas sobre a transição (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />

            <Button 
              onClick={handleStatusChange}
              disabled={isUpdating}
              className="w-full"
            >
              {config.nextLabel}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}