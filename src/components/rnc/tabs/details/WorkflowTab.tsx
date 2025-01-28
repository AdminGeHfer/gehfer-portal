// WorkflowTab.tsx
import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { WorkflowStatusBadge } from "@/components/quality/workflow/status/WorkflowStatusBadge";
import { WorkflowTransition } from "@/types/workflow";
import { rncService } from "@/services/rncService";
import { toast } from "sonner";

interface WorkflowTabProps {
  rncId: string;
  transitions: WorkflowTransition[];
  isEditing?: boolean;
}

export function WorkflowTab({ rncId, transitions, isEditing = false }: WorkflowTabProps) {
  const [editingTransitionId, setEditingTransitionId] = React.useState<string | null>(null);
  const [notes, setNotes] = React.useState("");
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdateNotes = async (transitionId: string) => {
    try {
      setIsUpdating(true);
      await rncService.updateWorkflowTransition(transitionId, rncId, {
        notes: notes
      });
      toast.success("Notas atualizadas com sucesso!");
      setEditingTransitionId(null);
    } catch (error) {
      console.error("Error updating notes:", error);
      toast.error("Erro ao atualizar notas");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditClick = (transition: WorkflowTransition) => {
    setEditingTransitionId(transition.id);
    setNotes(transition.notes || "");
  };

  return (
    <div className="space-y-6 p-4">
      {/* Timeline */}
      <div className="space-y-4">
        {transitions.map((transition) => (
          <div
            key={transition.id}
            className="flex gap-4 border-l-2 border-primary pl-4 pb-4"
          >
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <h4 className="font-medium">
                  <WorkflowStatusBadge status={transition.from_status} /> → <WorkflowStatusBadge status={transition.to_status} />
                </h4>
                <time className="text-sm text-muted-foreground">
                  {format(new Date(transition.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </time>
              </div>
              
              {editingTransitionId === transition.id ? (
                <div className="mt-2 space-y-2">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                    placeholder="Adicione uma nota a transição..."
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleUpdateNotes(transition.id)}
                      disabled={isUpdating}
                    >
                      Salvar
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingTransitionId(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {transition.notes}
                  </p>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(transition)}
                      className="mt-2"
                    >
                      Editar notas
                    </Button>
                  )}
                </>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                por {transition.created_by_profile.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
