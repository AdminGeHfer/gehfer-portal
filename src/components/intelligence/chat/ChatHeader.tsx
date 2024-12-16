import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ModelSelector } from "../shared/ModelSelector";

interface ChatHeaderProps {
  onDelete: () => void;
  isDeleting: boolean;
  model: string;
  onModelChange: (model: string) => void;
  isLoading: boolean;
}

export const ChatHeader = ({ 
  onDelete, 
  isDeleting, 
  model, 
  onModelChange,
  isLoading 
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <ModelSelector 
        value={model} 
        onValueChange={onModelChange}
        disabled={isLoading || isDeleting}
      />
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