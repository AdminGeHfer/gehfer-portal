import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  NodeMouseHandler
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StateNode } from './StateNode';
import { AddStateDialog } from './AddStateDialog';

const nodeTypes = {
  stateNode: StateNode,
};

interface WorkflowState {
  id: string;
  label: string;
  state_type: 'open' | 'analysis' | 'resolution' | 'solved' | 'closing' | 'closed';
  position_x: number;
  position_y: number;
  workflow_id: string;
}

interface WorkflowTransition {
  id: string;
  from_state_id: string;
  to_state_id: string;
  label: string;
  workflow_id: string;
}

const flowStyles = {
  background: 'rgb(248, 250, 252)',
};

export function WorkflowEditorCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isAddingState, setIsAddingState] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: workflow, isLoading } = useQuery({
    queryKey: ['workflow-template', 'default'],
    queryFn: async () => {
      const { data: template, error: templateError } = await supabase
        .from('workflow_templates')
        .select('*')
        .eq('is_default', true)
        .single();

      if (templateError) throw templateError;

      const { data: states, error: statesError } = await supabase
        .from('workflow_states')
        .select('*')
        .eq('workflow_id', template.id);

      if (statesError) throw statesError;

      const { data: transitions, error: transitionsError } = await supabase
        .from('workflow_transitions')
        .select('*')
        .eq('workflow_id', template.id);

      if (transitionsError) throw transitionsError;

      return {
        template,
        states,
        transitions,
      };
    },
  });

  useEffect(() => {
    if (workflow) {
      const flowNodes = workflow.states.map((state: WorkflowState) => ({
        id: state.id,
        type: 'stateNode',
        position: { x: state.position_x, y: state.position_y },
        data: { label: state.label, type: state.state_type },
        draggable: true,
      }));

      const flowEdges = workflow.transitions.map((transition: WorkflowTransition) => ({
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

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = async () => {
    if (!workflow?.template.id) return;

    try {
      const updates = nodes.map((node) => ({
        id: node.id,
        workflow_id: workflow.template.id,
        position_x: Math.round(node.position.x),
        position_y: Math.round(node.position.y),
        label: node.data.label,
        state_type: node.data.type,
      }));

      const { error } = await supabase
        .from('workflow_states')
        .upsert(updates);

      if (error) throw error;

      toast.success('Workflow salvo com sucesso');
      queryClient.invalidateQueries({ queryKey: ['workflow-template'] });
    } catch (error) {
      console.error('Erro ao salvar workflow:', error);
      toast.error('Erro ao salvar workflow');
    }
  };

  const handleNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node.id);
  }, []);

  const handleDeleteNode = async () => {
    if (!selectedNode) return;

    try {
      // Delete associated transitions first
      await supabase
        .from('workflow_transitions')
        .delete()
        .or(`from_state_id.eq.${selectedNode},to_state_id.eq.${selectedNode}`);

      // Then delete the state
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
      
      toast.success('Estado removido com sucesso');
      queryClient.invalidateQueries({ queryKey: ['workflow-template'] });
    } catch (error) {
      console.error('Erro ao deletar estado:', error);
      toast.error('Erro ao deletar estado');
    }
  };

  if (isLoading) {
    return <div>Carregando editor de workflow...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="h-[600px] border rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          style={flowStyles}
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
          <Panel position="top-right" className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingState(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Estado
            </Button>
            {selectedNode && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteNode}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Estado
              </Button>
            )}
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
          </Panel>
        </ReactFlow>
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