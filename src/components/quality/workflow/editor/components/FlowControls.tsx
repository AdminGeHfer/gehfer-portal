import { Panel } from 'reactflow';
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2 } from 'lucide-react';

interface FlowControlsProps {
  onAddState: () => void;
  onSave: () => void;
  onDelete: () => void;
  selectedNode: string | null;
}

export const FlowControls = ({ onAddState, onSave, onDelete, selectedNode }: FlowControlsProps) => {
  return (
    <Panel position="top-right" className="space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onAddState}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Estado
      </Button>
      {selectedNode && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir Estado
        </Button>
      )}
      <Button size="sm" onClick={onSave}>
        <Save className="mr-2 h-4 w-4" />
        Salvar
      </Button>
    </Panel>
  );
};