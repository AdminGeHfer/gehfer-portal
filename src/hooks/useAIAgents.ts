/* @ai-protected
 * type: "ai-agents-hook"
 * status: "optimized"
 * version: "2.0"
 * features: [
 *   "agent-management",
 *   "configuration-persistence",
 *   "state-management"
 * ]
 * last-modified: "2024-03-13"
 * checksum: "e2d1c0b9a8"
 * do-not-modify: true
 */

import { useAgentList } from "./useAgentList";
import { useAgentChat } from "./useAgentChat";
import { useAgentCreation } from "./useAgentCreation";
import { useAgentUpdate } from "./useAgentUpdate";
import { AIAgent } from "@/types/ai/agent";

export function useAIAgents() {
  const { agents, refreshAgents, isLoading } = useAgentList();
  const { startChat } = useAgentChat();
  const { createAgent } = useAgentCreation();
  const { updateAgent } = useAgentUpdate();

  const handleStartChat = (agentId: string) => {
    return startChat(agentId, agents);
  };

  const handleUpdateAgent = async (agentId: string, updatedAgent: Partial<AIAgent>) => {
    if (agentId === "") {
      const result = await createAgent(updatedAgent);
      if (result.success) {
        await refreshAgents();
      }
      return result;
    } else {
      const result = await updateAgent(agentId, updatedAgent);
      if (result.success) {
        await refreshAgents();
      }
      return result;
    }
  };

  return {
    agents,
    startChat: handleStartChat,
    updateAgent: handleUpdateAgent,
    refreshAgents,
    isLoading
  };
}
