import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Brain, Database, Settings, MessageSquare } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DocumentUpload } from "@/components/intelligence/DocumentUpload";
import { ModelSelector } from "@/components/intelligence/shared/ModelSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface AIAgent {
  id: string;
  name: string;
  description: string;
  type: string;
  hasKnowledgeBase: boolean;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

const AIHub = () => {
  const navigate = useNavigate();
  const [agents] = useState<AIAgent[]>([
    {
      id: "1",
      name: "Assistente de Qualidade",
      description: "Especializado em análise de RNCs e processos de qualidade",
      type: "quality",
      hasKnowledgeBase: true,
      model: "gpt-4o-mini",
      systemPrompt: "Você é um assistente especializado em qualidade, focado em análise de RNCs e melhoria de processos.",
    },
  ]);

  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");

  const startChat = (agentId: string) => {
    // Aqui você pode iniciar uma nova conversa com o agente selecionado
    navigate(`/intelligence/chat/new?agent=${agentId}`);
  };

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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Novo Agente IA</DialogTitle>
                <DialogDescription>
                  Configure um novo agente IA especializado para sua necessidade
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="model">Modelo</TabsTrigger>
                  <TabsTrigger value="advanced">Avançado</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
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
                </TabsContent>
                <TabsContent value="model" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Modelo de IA</Label>
                    <ModelSelector
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="systemPrompt">Prompt do Sistema</Label>
                    <Textarea
                      id="systemPrompt"
                      placeholder="Defina o comportamento base do agente..."
                      className="min-h-[150px]"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="advanced" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperatura</Label>
                    <Input
                      id="temperature"
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      defaultValue="0.7"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Máximo de Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      min="1"
                      max="32000"
                      defaultValue="4000"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="useKnowledgeBase" />
                    <Label htmlFor="useKnowledgeBase">
                      Usar Base de Conhecimento
                    </Label>
                  </div>
                </TabsContent>
              </Tabs>
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
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => startChat(agent.id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Iniciar Chat
                  </Button>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Configurar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Configurações - {agent.name}</DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="model" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="model">Modelo</TabsTrigger>
                          <TabsTrigger value="advanced">Avançado</TabsTrigger>
                        </TabsList>
                        <TabsContent value="model" className="space-y-4">
                          <div className="space-y-2">
                            <Label>Modelo de IA</Label>
                            <ModelSelector
                              value={agent.model || selectedModel}
                              onValueChange={setSelectedModel}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="systemPrompt">Prompt do Sistema</Label>
                            <Textarea
                              id="systemPrompt"
                              defaultValue={agent.systemPrompt}
                              placeholder="Defina o comportamento base do agente..."
                              className="min-h-[150px]"
                            />
                          </div>
                        </TabsContent>
                        <TabsContent value="advanced" className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="temperature">Temperatura</Label>
                            <Input
                              id="temperature"
                              type="number"
                              min="0"
                              max="2"
                              step="0.1"
                              defaultValue={agent.temperature || "0.7"}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maxTokens">Máximo de Tokens</Label>
                            <Input
                              id="maxTokens"
                              type="number"
                              min="1"
                              max="32000"
                              defaultValue={agent.maxTokens || "4000"}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="useKnowledgeBase"
                              defaultChecked={agent.hasKnowledgeBase}
                            />
                            <Label htmlFor="useKnowledgeBase">
                              Usar Base de Conhecimento
                            </Label>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
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