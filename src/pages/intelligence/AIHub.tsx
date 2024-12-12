import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AIAgentSettings } from "@/components/intelligence/agents/AIAgentSettings";
import { AIAgentList } from "@/components/intelligence/agents/AIAgentList";
import { useAIAgents } from "@/hooks/useAIAgents";
import { Plus } from "lucide-react";
import { AIAgentConfig } from "@/types/ai/agent";

const AIHub = () => {
  const { agents, startChat, updateAgent } = useAIAgents();

  const saveConfiguration = async (agentId: string, config: AIAgentConfig) => {
    await updateAgent(agentId, {
      name: config.name,
      description: config.description,
      model_id: config.modelId,
      memory_type: config.memoryType,
      use_knowledge_base: config.useKnowledgeBase,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      top_p: config.topP,
      top_k: config.topK,
      stop_sequences: config.stopSequences,
      chain_type: config.chainType,
      chunk_size: config.chunkSize,
      chunk_overlap: config.chunkOverlap,
      embedding_model: config.embeddingModel,
      search_type: config.searchType,
      search_threshold: config.searchThreshold,
      output_format: config.outputFormat,
      tools: config.tools,
      system_prompt: config.systemPrompt
    });
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
              <AIAgentSettings
                agent={{
                  id: "",
                  name: "",
                  description: "",
                  model_id: "gpt-4o-mini",
                  memory_type: "buffer",
                  use_knowledge_base: false,
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
                  system_prompt: "",
                  user_id: "",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }}
                onSave={saveConfiguration}
              />
            </DialogContent>
          </Dialog>
        </div>

        <AIAgentList
          agents={agents}
          onStartChat={startChat}
          onSaveConfiguration={saveConfiguration}
        />
      </main>
    </div>
  );
};

export default AIHub;