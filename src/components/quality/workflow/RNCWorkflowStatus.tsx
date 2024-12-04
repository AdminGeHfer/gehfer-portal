import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WorkflowStatusEnum } from "@/types/rnc";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface RNCWorkflowStatusProps {
  rncId: string;
  currentStatus: WorkflowStatusEnum;
  onStatusChange: (newStatus: WorkflowStatusEnum) => Promise<void>;
}

export function RNCWorkflowStatus({ rncId, currentStatus, onStatusChange }: RNCWorkflowStatusProps) {
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const { data: workflow, isLoading } = useQuery({
    queryKey: ['workflow-template', 'default'],
    queryFn: async () => {
      const { data: template } = await supabase
        .from('workflow_templates')
        .select('*')
        .eq('is_default', true)
        .single();

      if (!template) {
        throw new Error("No default workflow template found");
      }

      const { data: states } = await supabase
        .from('workflow_states')
        .select('*')
        .eq('workflow_id', template.id);

      const { data: transitions } = await supabase
        .from('workflow_transitions')
        .select('*')
        .eq('workflow_id', template.id);

      return {
        template,
        states: states || [],
        transitions: transitions || []
      };
    }
  });

  const getNextStates = () => {
    if (!workflow?.states || !workflow?.transitions) return [];
    
    const currentState = workflow.states.find(s => s.state_type === currentStatus);
    if (!currentState) return [];

    return workflow.transitions
      .filter(t => t.from_state_id === currentState.id)
      .map(t => {
        const toState = workflow.states.find(s => s.id === t.to_state_id);
        return toState ? {
          type: toState.state_type as WorkflowStatusEnum,
          label: toState.label
        } : null;
      })
      .filter(Boolean);
  };

  const handleStatusChange = async (newStatus: WorkflowStatusEnum) => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("Usuário não autenticado");
      }

      // Update RNC status
      const { error: rncError } = await supabase
        .from('rncs')
        .update({ workflow_status: newStatus })
        .eq('id', rncId);

      if (rncError) throw rncError;

      // Create transition record
      const { error: transitionError } = await supabase
        .from('rnc_workflow_transitions')
        .insert({
          rnc_id: rncId,
          from_status: currentStatus,
          to_status: newStatus,
          notes: notes.trim() || null,
          created_by: userData.user.id
        });

      if (transitionError) throw transitionError;

      // Invalidate queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['rnc', rncId] }),
        queryClient.invalidateQueries({ queryKey: ['workflow-transitions', rncId] }),
        queryClient.invalidateQueries({ queryKey: ['workflow-status', rncId] }),
        queryClient.invalidateQueries({ queryKey: ['rncs'] })
      ]);
      
      // Call onStatusChange after invalidating queries
      await onStatusChange(newStatus);
      
      toast.success("Status atualizado com sucesso");
      setNotes("");
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error("Erro ao atualizar status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusConfig = (status: WorkflowStatusEnum) => {
    const configs: Record<WorkflowStatusEnum, { label: string, className: string }> = {
      open: {
        label: "Aberto",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      },
      analysis: {
        label: "Em Análise",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      },
      resolution: {
        label: "Em Resolução",
        className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      },
      solved: {
        label: "Solucionado",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      },
      closing: {
        label: "Em Fechamento",
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      },
      closed: {
        label: "Encerrado",
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
      }
    };

    return configs[status] || configs.open;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status do Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  const nextStates = getNextStates();
  const config = getStatusConfig(currentStatus);

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

        {nextStates.length > 0 && (
          <>
            <Textarea
              placeholder="Notas sobre a transição (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />

            <div className="space-y-2">
              {nextStates.map((state) => (
                <Button 
                  key={state?.type}
                  onClick={() => state?.type && handleStatusChange(state.type)}
                  disabled={isUpdating}
                  className="w-full"
                >
                  {state?.label}
                </Button>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}