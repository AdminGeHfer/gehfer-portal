import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, Trash2, X } from "lucide-react";

interface StageHeaderProps {
  title: string;
  itemCount: number;
  isEditing: boolean;
  editingTitle: string;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  onTitleChange: (value: string) => void;
}

export const StageHeader = ({
  title,
  itemCount,
  isEditing,
  editingTitle,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onTitleChange,
}: StageHeaderProps) => {
  if (isEditing) {
    return (
      <div className="flex gap-2 w-full">
        <Input
          value={editingTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="h-8"
        />
        <Button size="icon" variant="ghost" onClick={onSave}>
          <Save className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      <span className="text-sm font-medium">
        {title} ({itemCount})
      </span>
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};