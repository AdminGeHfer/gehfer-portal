import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { AgentMetricsDashboard } from "./AgentMetricsDashboard";

interface MetricsDialogProps {
  agentId: string;
  agentName: string;
}

export const MetricsDialog = ({ agentId, agentName }: MetricsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Métricas de Qualidade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Métricas de Qualidade - {agentName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <AgentMetricsDashboard agentId={agentId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};