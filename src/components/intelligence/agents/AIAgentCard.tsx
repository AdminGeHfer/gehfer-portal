import { motion } from "framer-motion";
import { Brain, Database, MessageSquare, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIAgent } from "@/types/ai/agent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AIAgentSettings } from "./AIAgentSettings";
import { useState } from "react";
import { toast } from "sonner";

interface AIAgentCardProps {
  agent: AIAgent;
  onStartChat: (agentId: string) => void;
  onSaveConfiguration: (agentId: string, config: any) => void;
  onDelete: (agentId: string) => Promise<void>;
}

export const AIAgentCard = ({ 
  agent, 
  onStartChat, 
  onSaveConfiguration,
  onDelete 
}: AIAgentCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(agent.id);
      toast.success("Agente excluído com sucesso");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast.error("Erro ao excluir agente");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{agent.name}</h3>
              <p className="text-sm text-muted-foreground">
                {agent.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-shrink-0"
            onClick={() => onStartChat(agent.id)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Iniciar Chat
          </Button>
          {agent.use_knowledge_base && (
            <Button variant="outline" size="sm" className="flex-shrink-0">
              <Database className="h-4 w-4 mr-2" />
              Base de Conhecimento
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configurações - {agent.name}</DialogTitle>
              </DialogHeader>
              <AIAgentSettings agent={agent} onSave={onSaveConfiguration} />
            </DialogContent>
          </Dialog>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir Agente</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir o agente {agent.name}? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </motion.div>
  );
};