import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const stateColors = {
  open: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border-yellow-300',
  analysis: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-blue-300',
  resolution: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 border-purple-300',
  solved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-300',
  closing: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 border-orange-300',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 border-gray-300',
} as const;

interface StateNodeData {
  label: string;
  type: keyof typeof stateColors;
}

export const StateNode = memo(({ data, id }: NodeProps<StateNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(data.label);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('workflow_states')
        .update({ label: editedLabel })
        .eq('id', id);

      if (error) throw error;

      toast.success('Estado atualizado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['workflow-template'] });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar estado:', error);
      toast.error('Erro ao atualizar estado');
    }
  };

  return (
    <div className={cn(
      'px-4 py-2 shadow-lg rounded-lg border-2',
      'min-w-[150px] text-center',
      'transition-colors duration-200',
      stateColors[data.type]
    )}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 !bg-gray-400" 
      />
      
      <div className="relative">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              className="h-8 text-sm"
              autoFocus
            />
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={handleSave}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => {
                  setIsEditing(false);
                  setEditedLabel(data.label);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="font-bold">{data.label}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 !bg-gray-400" 
      />
    </div>
  );
});

StateNode.displayName = 'StateNode';