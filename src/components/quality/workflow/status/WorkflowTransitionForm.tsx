import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WorkflowStatusEnum } from "@/types/rnc";
import { useState } from "react";

interface WorkflowTransitionFormProps {
  nextStates: Array<{ type: WorkflowStatusEnum; label: string }>;
  onTransition: (newStatus: WorkflowStatusEnum, notes: string) => Promise<void>;
  isUpdating: boolean;
}

export function WorkflowTransitionForm({ 
  nextStates, 
  onTransition, 
  isUpdating 
}: WorkflowTransitionFormProps) {
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Notas sobre a transição (opcional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[100px]"
      />

      <div className="space-y-2">
        {nextStates.map((state) => (
          <Button 
            key={state.type}
            onClick={() => onTransition(state.type, notes)}
            disabled={isUpdating}
            className="w-full"
          >
            {state.label}
          </Button>
        ))}
      </div>
    </div>
  );
}