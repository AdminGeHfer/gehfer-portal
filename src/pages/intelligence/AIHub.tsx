import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Brain, Database, Settings } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DocumentUpload } from "@/components/intelligence/DocumentUpload";

interface AIAgent {
  id: string;
  name: string;
  description: string;
  type: string;
  hasKnowledgeBase: boolean;
}

const AIHub = () => {
  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: "1",
      name: "Assistente de Qualidade",
      description: "Especializado em análise de RNCs e processos de qualidade",
      type: "quality",
      hasKnowledgeBase: true,
    },
    // Add more pre-configured agents as needed
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Hub IA" subtitle="Gestão de Agentes IA Especializados" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Agentes IA</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Agente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Agente IA</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Agente</Label>
                  <Input id="name" placeholder="Ex: Assistente de Qualidade" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva as capacidades do agente..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Base de Conhecimento</Label>
                  <DocumentUpload />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
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

                <div className="flex gap-2">
                  {agent.hasKnowledgeBase && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Database className="h-4 w-4" />
                          Base de Conhecimento
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Base de Conhecimento - {agent.name}</DialogTitle>
                        </DialogHeader>
                        <DocumentUpload moduleId={agent.id} />
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Configurar
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AIHub;