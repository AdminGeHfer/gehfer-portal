import { useDroppable } from "@dnd-kit/core";
import { StageHeader } from "./StageHeader";
import { DraggableLeadCard } from "./DraggableLeadCard";

interface StageProps {
  id: string;
  title: string;
  items: {
    id: string;
    name: string;
    email: string;
    phone: string;
  }[];
  isEditing: boolean;
  editingTitle: string;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  onTitleChange: (value: string) => void;
}

export const Stage = ({
  id,
  title,
  items,
  isEditing,
  editingTitle,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onTitleChange,
}: StageProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2">
        <StageHeader
          title={title}
          itemCount={items.length}
          isEditing={isEditing}
          editingTitle={editingTitle}
          onEdit={onEdit}
          onDelete={onDelete}
          onSave={onSave}
          onCancel={onCancel}
          onTitleChange={onTitleChange}
        />
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-lg p-2 space-y-2 overflow-auto transition-colors ${
          isOver ? "bg-accent" : "bg-accent/50"
        }`}
      >
        {items.map((item) => (
          <DraggableLeadCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};