import { Handle, NodeProps, Position } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function StateNode({ data }: NodeProps) {
  const getStateColor = (type: string) => {
    switch (type) {
      case 'open':
        return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/50 dark:border-yellow-700';
      case 'analysis':
        return 'bg-blue-100 border-blue-300 dark:bg-blue-900/50 dark:border-blue-700';
      case 'resolution':
        return 'bg-purple-100 border-purple-300 dark:bg-purple-900/50 dark:border-purple-700';
      case 'solved':
        return 'bg-green-100 border-green-300 dark:bg-green-900/50 dark:border-green-700';
      case 'closing':
        return 'bg-orange-100 border-orange-300 dark:bg-orange-900/50 dark:border-orange-700';
      case 'closed':
        return 'bg-gray-100 border-gray-300 dark:bg-gray-900/50 dark:border-gray-700';
      default:
        return 'bg-gray-100 border-gray-300 dark:bg-gray-900/50 dark:border-gray-700';
    }
  };

  return (
    <div className={cn(
      "px-4 py-2 shadow-lg rounded-lg border-2",
      "transition-colors duration-200",
      "min-w-[180px] text-center",
      getStateColor(data.type)
    )}>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-400 !w-3 !h-3"
      />
      
      <div className="font-medium">{data.label}</div>
      <Badge variant="secondary" className="mt-1">
        {data.type}
      </Badge>
      
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400 !w-3 !h-3"
      />
    </div>
  );
}