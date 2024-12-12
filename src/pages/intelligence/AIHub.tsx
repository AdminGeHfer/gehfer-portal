import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Brain, Database, Settings, MessageSquare, Save } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ModelSelector } from "@/components/intelligence/shared/ModelSelector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AIAgentBasicConfig } from "@/components/intelligence/config/AIAgentBasicConfig";
import { AIAgentModelConfig } from "@/components/intelligence/config/AIAgentModelConfig";
import { AIAgentAdvancedConfig } from "@/components/intelligence/config/AIAgentAdvancedConfig";
import { AIAgentKnowledgeBase } from "@/components/intelligence/config/AIAgentKnowledgeBase";
import { AIAgentToolsConfig } from "@/components/intelligence/config/AIAgentToolsConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { AIAgent, AIAgentConfig } from "@/types/ai/agent";

const AIHub = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: "1",
      name: "Assistente de Qualidade",
      description: "Especializado em análise de RNCs e processos de qualidade",
      model_id: "gpt-4o-mini",
      memory_type: "buffer",
      use_knowledge_base: true,
      temperature: 0.7,
      max_tokens: 4000,
      top_p: 0.9,
      top_k: 50,
      stop_sequences: [],
      chain_type: "conversation",
      chunk_size: 1000,
      chunk_overlap: 200,
      embedding_model: "openai",
      search_type: "similarity",
      search_threshold: 0.7,
      output_format: "text",
      tools: [],
      system_prompt: "Você é um assistente especializado em qualidade, focado em análise de RNCs e melhoria de processos.",
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      configuration: {}
    },
  ]);

  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [currentConfig, setCurrentConfig] = useState<AIAgentConfig>({
    name: "",
    description: "",
    modelId: "gpt-4o-mini",
    memoryType: "buffer",
    useKnowledgeBase: false,
    temperature: 0.7,
    maxTokens: 4000,
    topP: 0.9,
    topK: 50,
    stopSequences: [],
    chainType: "conversation",
    chunkSize: 1000,
    chunkOverlap: 200,
    embeddingModel: "openai",
    searchType: "similarity",
    searchThreshold: 0.7,
    outputFormat: "text",
    tools: [],
    systemPrompt: "",
  });

  const startChat = async (agentId: string) => {
    try {
      const agent = agents.find(a => a.id === agentId);
      if (!agent) return;

      const { data: conversation, error: convError } = await supabase
        .from('ai_conversations')
        .insert({
          title: `Chat with ${agent.name}`,
          user_id: agent.user_id
        })
        .select()
        .single();

      if (convError) throw convError;

      navigate(`/intelligence/chat/${conversation.id}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: "Error",
        description: "Failed to start chat session",
        variant: "destructive",
      });
    }
  };

  const saveConfiguration = async (agentId: string, config: AIAgentConfig) => {
    try {
      const { error } = await supabase
        .from('ai_agents')
        .update({ 
          configuration: config,
          memory_type: config.memoryType,
          chain_type: config.chainType,
          search_type: config.searchType,
          output_format: config.outputFormat
        })
        .eq('id', agentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Configuration saved successfully",
      });

      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, configuration: config }
          : agent
      ));
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    }
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
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="model">Modelo</TabsTrigger>
                  <TabsTrigger value="advanced">Avançado</TabsTrigger>
                  <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
                  <TabsTrigger value="tools">Ferramentas</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                  <AIAgentBasicConfig
                    name={currentConfig.name}
                    description={currentConfig.description}
                    modelId={currentConfig.modelId}
                    memoryType={currentConfig.memoryType}
                    useKnowledgeBase={currentConfig.useKnowledgeBase}
                    onNameChange={(value) => setCurrentConfig(prev => ({ ...prev, name: value }))}
                    onDescriptionChange={(value) => setCurrentConfig(prev => ({ ...prev, description: value }))}
                    onModelChange={(value) => setCurrentConfig(prev => ({ ...prev, modelId: value }))}
                    onMemoryTypeChange={(value) => setCurrentConfig(prev => ({ ...prev, memoryType: value }))}
                    onKnowledgeBaseToggle={(value) => setCurrentConfig(prev => ({ ...prev, useKnowledgeBase: value }))}
                  />
                </TabsContent>
                <TabsContent value="model">
                  <AIAgentModelConfig
                    temperature={currentConfig.temperature}
                    maxTokens={currentConfig.maxTokens}
                    topP={currentConfig.topP}
                    topK={currentConfig.topK}
                    stopSequences={currentConfig.stopSequences}
                    onTemperatureChange={(value) => setCurrentConfig(prev => ({ ...prev, temperature: value }))}
                    onMaxTokensChange={(value) => setCurrentConfig(prev => ({ ...prev, maxTokens: value }))}
                    onTopPChange={(value) => setCurrentConfig(prev => ({ ...prev, topP: value }))}
                    onTopKChange={(value) => setCurrentConfig(prev => ({ ...prev, topK: value }))}
                    onStopSequencesChange={(value) => setCurrentConfig(prev => ({ ...prev, stopSequences: value }))}
                  />
                </TabsContent>
                <TabsContent value="advanced">
                  <AIAgentAdvancedConfig
                    chainType={currentConfig.chainType}
                    chunkSize={currentConfig.chunkSize}
                    chunkOverlap={currentConfig.chunkOverlap}
                    embeddingModel={currentConfig.embeddingModel}
                    searchType={currentConfig.searchType}
                    searchThreshold={currentConfig.searchThreshold}
                    outputFormat={currentConfig.outputFormat}
                    onChainTypeChange={(value) => setCurrentConfig(prev => ({ ...prev, chainType: value }))}
                    onChunkSizeChange={(value) => setCurrentConfig(prev => ({ ...prev, chunkSize: value }))}
                    onChunkOverlapChange={(value) => setCurrentConfig(prev => ({ ...prev, chunkOverlap: value }))}
                    onEmbeddingModelChange={(value) => setCurrentConfig(prev => ({ ...prev, embeddingModel: value }))}
                    onSearchTypeChange={(value) => setCurrentConfig(prev => ({ ...prev, searchType: value }))}
                    onSearchThresholdChange={(value) => setCurrentConfig(prev => ({ ...prev, searchThreshold: value }))}
                    onOutputFormatChange={(value) => setCurrentConfig(prev => ({ ...prev, outputFormat: value }))}
                  />
                </TabsContent>
                <TabsContent value="knowledge">
                  <AIAgentKnowledgeBase
                    chunkSize={currentConfig.chunkSize}
                    chunkOverlap={currentConfig.chunkOverlap}
                    embeddingModel={currentConfig.embeddingModel}
                    searchType={currentConfig.searchType}
                    onChunkSizeChange={(value) => setCurrentConfig(prev => ({ ...prev, chunkSize: value }))}
                    onChunkOverlapChange={(value) => setCurrentConfig(prev => ({ ...prev, chunkOverlap: value }))}
                    onEmbeddingModelChange={(value) => setCurrentConfig(prev => ({ ...prev, embeddingModel: value }))}
                    onSearchTypeChange={(value) => setCurrentConfig(prev => ({ ...prev, searchType: value }))}
                  />
                </TabsContent>
                <TabsContent value="tools">
                  <AIAgentToolsConfig
                    tools={currentConfig.tools}
                    systemPrompt={currentConfig.systemPrompt}
                    onToolsChange={(value) => setCurrentConfig(prev => ({ ...prev, tools: value }))}
                    onSystemPromptChange={(value) => setCurrentConfig(prev => ({ ...prev, systemPrompt: value }))}
                  />
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
                    onClick={() => startChat(agent.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Iniciar Chat
                  </Button>
                  {agent.hasKnowledgeBase && (
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
                      <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                          <TabsTrigger value="basic">Básico</TabsTrigger>
                          <TabsTrigger value="model">Modelo</TabsTrigger>
                          <TabsTrigger value="advanced">Avançado</TabsTrigger>
                          <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
                          <TabsTrigger value="tools">Ferramentas</TabsTrigger>
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
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => saveConfiguration(agent.id, currentConfig)}
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Salvar Configurações
                        </Button>
                      </div>
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
