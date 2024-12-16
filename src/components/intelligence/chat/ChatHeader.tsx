import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ModelSelector } from "../shared/ModelSelector";

interface ChatHeaderProps {
  title: string;
  model: string;
  onModelChange: (model: string) => void;
  isDeleting: boolean;
  onDelete: () => void;
  isLoading: boolean;
}

export const ChatHeader = ({ 
  title, 
  model, 
  onModelChange,
  isDeleting,
  onDelete,
  isLoading 
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <ModelSelector 
          value={model} 
          onValueChange={onModelChange}
          disabled={isLoading || isDeleting}
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        disabled={isDeleting}
        onClick={onDelete}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};