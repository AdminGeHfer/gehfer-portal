/* @ai-protected
 * type: "agent-settings"
 * status: "optimized"
 * version: "2.0"
 * features: [
 *   "dynamic-settings",
 *   "prompt-configuration",
 *   "model-selection"
 * ]
 * last-modified: "2024-03-13"
 * checksum: "b7a6c5d4e3"
 * do-not-modify: true
 */

import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAgent, AIAgentConfig, MemoryType, ChainType, SearchType, OutputFormat } from "@/types/ai/agent";
import { AIAgentBasicConfig } from "../config/AIAgentBasicConfig";
import { AIAgentModelConfig } from "../config/AIAgentModelConfig";
import { AIAgentAdvancedConfig } from "../config/AIAgentAdvancedConfig";
import { AIAgentKnowledgeBase } from "../config/AIAgentKnowledgeBase";
import { AIAgentToolsConfig } from "../config/AIAgentToolsConfig";

interface AIAgentSettingsProps {
  agent: AIAgent;
  onSave: (agentId: string, config: AIAgentConfig) => void;
}

export const AIAgentSettings = ({ agent, onSave }: AIAgentSettingsProps) => {
  const [config, setConfig] = useState<AIAgentConfig>({
    name: agent.name,
    description: agent.description || "",
    modelId: agent.model_id,
    memoryType: agent.memory_type,
    useKnowledgeBase: agent.use_knowledge_base,
    temperature: agent.temperature,
    maxTokens: agent.max_tokens,
    topP: agent.top_p,
    topK: agent.top_k,
    stopSequences: agent.stop_sequences,
    chainType: agent.chain_type,
    chunkSize: agent.chunk_size,
    chunkOverlap: agent.chunk_overlap,
    embeddingModel: agent.embedding_model,
    searchType: agent.search_type,
    searchThreshold: agent.search_threshold,
    outputFormat: agent.output_format,
    tools: agent.tools,
    systemPrompt: agent.system_prompt || "",
  });

  return (
    <>
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
            name={config.name}
            description={config.description}
            modelId={config.modelId}
            memoryType={config.memoryType}
            useKnowledgeBase={config.useKnowledgeBase}
            onNameChange={(value) => setConfig(prev => ({ ...prev, name: value }))}
            onDescriptionChange={(value) => setConfig(prev => ({ ...prev, description: value }))}
            onModelChange={(value) => setConfig(prev => ({ ...prev, modelId: value }))}
            onMemoryTypeChange={(value) => setConfig(prev => ({ ...prev, memoryType: value as MemoryType }))}
            onKnowledgeBaseToggle={(value) => setConfig(prev => ({ ...prev, useKnowledgeBase: value }))}
          />
        </TabsContent>
        <TabsContent value="model">
          <AIAgentModelConfig
            temperature={config.temperature}
            maxTokens={config.maxTokens}
            topP={config.topP}
            topK={config.topK}
            stopSequences={config.stopSequences}
            onTemperatureChange={(value) => setConfig(prev => ({ ...prev, temperature: value }))}
            onMaxTokensChange={(value) => setConfig(prev => ({ ...prev, maxTokens: value }))}
            onTopPChange={(value) => setConfig(prev => ({ ...prev, topP: value }))}
            onTopKChange={(value) => setConfig(prev => ({ ...prev, topK: value }))}
            onStopSequencesChange={(value) => setConfig(prev => ({ ...prev, stopSequences: value }))}
          />
        </TabsContent>
        <TabsContent value="advanced">
          <AIAgentAdvancedConfig
            chainType={config.chainType}
            chunkSize={config.chunkSize}
            chunkOverlap={config.chunkOverlap}
            embeddingModel={config.embeddingModel}
            searchType={config.searchType}
            searchThreshold={config.searchThreshold}
            outputFormat={config.outputFormat}
            onChainTypeChange={(value) => setConfig(prev => ({ ...prev, chainType: value as ChainType }))}
            onChunkSizeChange={(value) => setConfig(prev => ({ ...prev, chunkSize: value }))}
            onChunkOverlapChange={(value) => setConfig(prev => ({ ...prev, chunkOverlap: value }))}
            onEmbeddingModelChange={(value) => setConfig(prev => ({ ...prev, embeddingModel: value }))}
            onSearchTypeChange={(value) => setConfig(prev => ({ ...prev, searchType: value as SearchType }))}
            onSearchThresholdChange={(value) => setConfig(prev => ({ ...prev, searchThreshold: value }))}
            onOutputFormatChange={(value) => setConfig(prev => ({ ...prev, outputFormat: value as OutputFormat }))}
          />
        </TabsContent>
        <TabsContent value="knowledge">
          <AIAgentKnowledgeBase
            agentId={agent.id} // Fix: Pass the agent ID
            chunkSize={config.chunkSize}
            chunkOverlap={config.chunkOverlap}
            embeddingModel={config.embeddingModel}
            searchType={config.searchType}
            onChunkSizeChange={(value) => setConfig(prev => ({ ...prev, chunkSize: value }))}
            onChunkOverlapChange={(value) => setConfig(prev => ({ ...prev, chunkOverlap: value }))}
            onEmbeddingModelChange={(value) => setConfig(prev => ({ ...prev, embeddingModel: value }))}
            onSearchTypeChange={(value) => setConfig(prev => ({ ...prev, searchType: value as SearchType }))}
          />
        </TabsContent>
        <TabsContent value="tools">
          <AIAgentToolsConfig
            tools={config.tools}
            systemPrompt={config.systemPrompt}
            onToolsChange={(value) => setConfig(prev => ({ ...prev, tools: value }))}
            onSystemPromptChange={(value) => setConfig(prev => ({ ...prev, systemPrompt: value }))}
          />
        </TabsContent>
      </Tabs>
      <div className="flex justify-end mt-4">
        <Button
          onClick={() => onSave(agent.id, config)}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </>
  );
};
