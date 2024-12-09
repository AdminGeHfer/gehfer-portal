import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Node, Edge } from "reactflow";
import { WorkflowStatusEnum } from "@/types/rnc";

interface WorkflowState {
  id: string;
  label: string;
  state_type: WorkflowStatusEnum;
  position_x: number;
  position_y: number;
  assigned_to?: string;
  send_email?: boolean;
  email_template?: string;
}

interface WorkflowData {
  template: {
    id: string;
  };
  states: WorkflowState[];
  transitions: any[];
}

export function useWorkflowData() {
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

  const handleSave = async (nodes: Node[], edges: Edge[]) => {
    if (!workflow?.template.id) return;

    try {
      const updates = nodes.map((node) => ({
        id: node.id,
        workflow_id: workflow.template.id,
        position_x: Math.round(node.position.x),
        position_y: Math.round(node.position.y),
        label: node.data.label,
        state_type: node.data.type,
        assigned_to: node.data.assigned_to,
        send_email: node.data.send_email,
        email_template: node.data.email_template,
      }));

      const { error } = await supabase
        .from('workflow_states')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['workflow-template'] });
      toast.success('Workflow salvo com sucesso');
    } catch (error) {
      console.error('Erro ao salvar workflow:', error);
      toast.error('Erro ao salvar workflow');
    }
  };

  return {
    workflow,
    isLoading,
    handleSave
  };
}