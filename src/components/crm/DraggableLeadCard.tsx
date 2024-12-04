import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LeadCard } from "./LeadCard";
import { LeadScore } from "@/utils/leadScoring";

interface DraggableLeadCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  score?: LeadScore;
}

export const DraggableLeadCard = ({ id, name, email, phone, score }: DraggableLeadCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeadCard id={id} name={name} email={email} phone={phone} score={score} />
    </div>
  );
};