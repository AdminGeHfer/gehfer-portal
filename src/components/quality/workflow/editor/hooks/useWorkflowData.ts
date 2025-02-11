import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Node } from "reactflow";

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

  const handleSave = async (nodes: Node[]) => {
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
        send_notification: node.data.send_notification,
        notification_template: node.data.notification_template,
      }));

      const { error } = await supabase
        .from('workflow_states')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;

      // Then create notifications for each state that has notifications enabled
      for (const node of nodes) {
        if (node.data.send_notification) {
          const { count, error: notifyError } = await supabase
            .rpc('create_workflow_state_notifications_rpc', {
              p_state_id: node.id
            });

          if (notifyError) throw notifyError;

          if (count > 0) {
            toast.success(`${count} notificações criadas para o estado ${node.data.label}`);
          }
        }
      }

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