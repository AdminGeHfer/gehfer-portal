import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, Connection, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AddStateDialog } from './AddStateDialog';
import { FlowCanvas } from './components/FlowCanvas';
import { useWorkflowData } from './hooks/useWorkflowData';
import { useQueryClient } from '@tanstack/react-query';

export function WorkflowEditorCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isAddingState, setIsAddingState] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { workflow, isLoading, handleSave } = useWorkflowData();

  useEffect(() => {
    if (workflow) {
      const flowNodes = workflow.states.map((state) => ({
        id: state.id,
        type: 'stateNode',
        position: { x: state.position_x, y: state.position_y },
        data: {
          label: state.label,
          type: state.state_type,
          assigned_to: state.assigned_to,
          send_notification: state.send_notification,
          notification_template: state.notification_template,
          onAssigneeChange: (value: string) => handleStateUpdate(state.id, { assigned_to: value }),
          onNotificationToggle: (checked: boolean) => handleStateUpdate(state.id, { send_notification: checked }),
          onNotificationTemplateChange: (value: string) => handleStateUpdate(state.id, { notification_template: value }),
        },
        draggable: true,
      }));

      const flowEdges = workflow.transitions.map((transition) => ({
        id: transition.id,
        source: transition.from_state_id,
        target: transition.to_state_id,
        label: transition.label,
        animated: true,
        style: { stroke: '#64748b' },
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [workflow, setNodes, setEdges]);

  const handleStateUpdate = async (stateId: string, updates) => {
    try {
      const { error } = await supabase
        .from('workflow_states')
        .update(updates)
        .eq('id', stateId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['workflow-template'] });
      toast.success('Estado atualizado com sucesso');
    } catch (error) {
      console.error('Error updating state:', error);
      toast.error('Erro ao atualizar estado');
    }
  };

  const onConnect = useCallback(async (params: Connection | Edge) => {
    if (!workflow?.template.id || !params.source || !params.target) return;

    try {
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (!sourceNode || !targetNode) return;

      const { data: transition, error } = await supabase
        .from('workflow_transitions')
        .insert({
          workflow_id: workflow.template.id,
          from_state_id: params.source,
          to_state_id: params.target,
          label: `${sourceNode.data.label} → ${targetNode.data.label}`
        })
        .select()
        .single();

      if (error) throw error;

      setEdges(eds => [...eds, {
        id: transition.id,
        source: transition.from_state_id,
        target: transition.to_state_id,
        label: transition.label,
        animated: true,
        style: { stroke: '#64748b' },
      }]);

      await queryClient.invalidateQueries({ queryKey: ['workflow-template'] });
      toast.success('Transição salva com sucesso');
    } catch (error) {
      console.error('Erro ao salvar transição:', error);
      toast.error('Erro ao salvar transição');
    }
  }, [workflow?.template.id, nodes, queryClient]);

  const handleDeleteEdge = async () => {
    if (!selectedEdge) return;

    try {
      const { error } = await supabase
        .from('workflow_transitions')
        .delete()
        .eq('id', selectedEdge);

      if (error) throw error;

      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge));
      setSelectedEdge(null);
      
      await queryClient.invalidateQueries({ queryKey: ['workflow-template'] });
      toast.success('Transição removida com sucesso');
    } catch (error) {
      console.error('Erro ao deletar transição:', error);
      toast.error('Erro ao deletar transição');
    }
  };

  const handleDeleteNode = async () => {
    if (!selectedNode) return;

    try {
      await supabase
        .from('workflow_transitions')
        .delete()
        .or(`from_state_id.eq.${selectedNode},to_state_id.eq.${selectedNode}`);

      const { error } = await supabase
        .from('workflow_states')
        .delete()
        .eq('id', selectedNode);

      if (error) throw error;

      setNodes((nds) => nds.filter((node) => node.id !== selectedNode));
      setEdges((eds) => eds.filter(
        (edge) => edge.source !== selectedNode && edge.target !== selectedNode
      ));
      setSelectedNode(null);
      
      await queryClient.invalidateQueries({ queryKey: ['workflow-template'] });
      toast.success('Estado removido com sucesso');
    } catch (error) {
      console.error('Erro ao deletar estado:', error);
      toast.error('Erro ao deletar estado');
    }
  };

  if (isLoading) {
    return <div>Carregando editor do fluxo de notificações...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="h-[600px] border rounded-lg">
        <ReactFlowProvider>
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNode(node.id)}
            onEdgeClick={(_, edge) => setSelectedEdge(edge.id)}
            onAddState={() => setIsAddingState(true)}
            onSave={() => handleSave(nodes)}
            onDelete={handleDeleteNode}
            onDeleteEdge={handleDeleteEdge}
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
          />
        </ReactFlowProvider>
      </div>

      <AddStateDialog
        open={isAddingState}
        onOpenChange={setIsAddingState}
        workflowId={workflow?.template.id}
        onStateAdded={() => {
          setIsAddingState(false);
          queryClient.invalidateQueries({ queryKey: ['workflow-template'] });
        }}
      />
    </div>
  );
}