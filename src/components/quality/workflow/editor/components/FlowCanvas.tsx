import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  NodeMouseHandler
} from 'reactflow';
import { StateNode } from '../StateNode';
import { FlowControls } from './FlowControls';

const nodeTypes = {
  stateNode: StateNode,
};

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection | Edge) => void;
  onNodeClick: NodeMouseHandler;
  onAddState: () => void;
  onSave: () => void;
  onDelete: () => void;
  onDeleteEdge: () => void;
  selectedNode: string | null;
  selectedEdge: string | null;
}

export const FlowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onAddState,
  onSave,
  onDelete,
  onDeleteEdge,
  selectedNode,
  selectedEdge,
}: FlowCanvasProps) => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      fitView
      style={{ background: 'rgb(248, 250, 252)' }}
    >
      <Controls />
      <MiniMap />
      <Background gap={12} size={1} />
      <FlowControls
        onAddState={onAddState}
        onSave={onSave}
        onDelete={onDelete}
        onDeleteEdge={onDeleteEdge}
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
      />
    </ReactFlow>
  );
};