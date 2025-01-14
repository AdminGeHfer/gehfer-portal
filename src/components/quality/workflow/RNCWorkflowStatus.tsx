import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WorkflowStatusEnum } from "@/types/rnc";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefetchOptions } from "@tanstack/react-query";
import { WorkflowStatusBadge } from "./status/WorkflowStatusBadge";
import { WorkflowTransitionForm } from "./status/WorkflowTransitionForm";

interface RNCWorkflowStatusProps {
  rncId: string;
  currentStatus: WorkflowStatusEnum;
  onStatusChange: (newStatus: WorkflowStatusEnum) => Promise<void>;
  onRefresh: (options?: RefetchOptions) => Promise<void>;
}

export function RNCWorkflowStatus({ 
  rncId, 
  currentStatus, 
  onStatusChange, 
  onRefresh 
}: RNCWorkflowStatusProps) {
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

  const handleStatusChange = async (newStatus: WorkflowStatusEnum, notes: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("Usuário não autenticado");
      }

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

      await onStatusChange(newStatus);
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['rnc', rncId] }),
        queryClient.invalidateQueries({ queryKey: ['workflow-transitions', rncId] }),
        queryClient.invalidateQueries({ queryKey: ['workflow-status', rncId] }),
        queryClient.invalidateQueries({ queryKey: ['rncs'] })
      ]);
      
      await onRefresh();
      
      toast.success("Status atualizado com sucesso");
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Erro ao atualizar status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-[600px] mx-auto px-2">
        <CardHeader className="px-3">
          <CardTitle>Status do Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  const nextStates = getNextStates();

  return (
    <Card className="w-full max-w-[600px] mx-auto px-2">
      <CardHeader className="px-3">
        <CardTitle>Status do Workflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <WorkflowStatusBadge status={currentStatus} />
        </div>

        {nextStates.length > 0 && (
          <WorkflowTransitionForm
            nextStates={nextStates}
            onTransition={handleStatusChange}
            isUpdating={isUpdating}
          />
        )}
      </CardContent>
    </Card>
  );
}