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
  const { workflow, isLoading, error, handleSave } = useWorkflowData();

  useEffect(() => {
    if (workflow) {
      const flowNodes = workflow.states.map((state: any) => ({
        id: state.id,
        type: 'stateNode',
        position: { x: state.position_x, y: state.position_y },
        data: {
          label: state.label,
          type: state.state_type,
          assigned_to: state.assigned_to,
          send_email: state.send_email,
          email_template: state.email_template,
          onAssigneeChange: (value: string) => handleStateUpdate(state.id, { assigned_to: value }),
          onEmailToggle: (checked: boolean) => handleStateUpdate(state.id, { send_email: checked }),
          onEmailTemplateChange: (value: string) => handleStateUpdate(state.id, { email_template: value }),
        },
        draggable: true,
      }));

      const flowEdges = workflow.transitions.map((transition: any) => ({
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

  const handleStateUpdate = async (stateId: string, updates: any) => {
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

  const handleDelete = async () => {
    if (!selectedNode || !workflow?.template.id) return;

    try {
      const { error } = await supabase
        .from('workflow_states')
        .delete()
        .eq('id', selectedNode);

      if (error) throw error;

      setNodes(nodes => nodes.filter(node => node.id !== selectedNode));
      setSelectedNode(null);
      queryClient.invalidateQueries({ queryKey: ['workflow-template'] });
      toast.success('Estado removido com sucesso');
    } catch (error) {
      console.error('Error deleting state:', error);
      toast.error('Erro ao remover estado');
    }
  };

  const handleDeleteEdge = async () => {
    if (!selectedEdge || !workflow?.template.id) return;

    try {
      const { error } = await supabase
        .from('workflow_transitions')
        .delete()
        .eq('id', selectedEdge);

      if (error) throw error;

      setEdges(edges => edges.filter(edge => edge.id !== selectedEdge));
      setSelectedEdge(null);
      queryClient.invalidateQueries({ queryKey: ['workflow-template'] });
      toast.success('Transição removida com sucesso');
    } catch (error) {
      console.error('Error deleting transition:', error);
      toast.error('Erro ao remover transição');
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

  if (error) {
    return <div className="p-4 text-red-500">Error loading workflow: {error.message}</div>;
  }

  if (isLoading) {
    return <div className="p-4">Carregando editor de workflow...</div>;
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
            onSave={() => handleSave(nodes, edges)}
            onDelete={handleDelete}
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