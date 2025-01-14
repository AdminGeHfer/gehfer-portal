import React from "react";
import { AIAgent } from "@/types/ai/agent";
import { AIAgentCard } from "@/components/intelligence/agents/AIAgentCard";

interface AIAgentListProps {
  agents: AIAgent[];
  onStartChat: (agentId: string) => void;
  onSaveConfiguration: (agentId: string, config) => void;
  onDelete: (agentId: string) => Promise<void>;
}

export const AIAgentList = ({ 
  agents, 
  onStartChat, 
  onSaveConfiguration,
  onDelete 
}: AIAgentListProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <AIAgentCard
          key={agent.id}
          agent={agent}
          onStartChat={onStartChat}
          onSaveConfiguration={onSaveConfiguration}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};