import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { WorkflowStatusBadge } from "@/components/quality/workflow/status/WorkflowStatusBadge";
import { WorkflowStatusEnum } from "@/types/rnc";

export function WorkflowTab() {
  return (
    <div className="space-y-6 p-4">
      {/* Timeline */}
      <div className="space-y-4">
        {[
          {
            id: 1,
            date: new Date(),
            from: WorkflowStatusEnum.open,
            to: WorkflowStatusEnum.analysis,
            notes: "RNC movida para análise",
            user: "João Silva",
          },
          // Add more transitions here
        ].map((transition) => (
          <div
            key={transition.id}
            className="flex gap-4 border-l-2 border-primary pl-4 pb-4"
          >
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <h4 className="font-medium">
                  <WorkflowStatusBadge status={transition.from} /> → <WorkflowStatusBadge status={transition.to} />
                </h4>
                <time className="text-sm text-muted-foreground">
                  {format(transition.date, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </time>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {transition.notes}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                por {transition.user}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add new note */}
      <div className="space-y-4">
        <Textarea
          placeholder="Adicione uma nota ao workflow..."
          className="min-h-[100px]"
        />
        <Button>Adicionar Nota</Button>
      </div>
    </div>
  );
}