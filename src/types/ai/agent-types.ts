export type AgentType = 'openai' | 'n8n' | 'flowise';

export interface AgentTemplate {
  id: string;
  name: string;
  description?: string;
  agentType: AgentType;
  configuration: Record<string, unknown>;
  createdAt: string;
  createdBy?: string;
  isPublic: boolean;
}

export interface ExternalAgentConfig {
  externalUrl?: string;
  authToken?: string;
  icon?: string;
  color?: string;
  templateId?: string;
  connectionStatus?: string;
  lastTested?: string;
}