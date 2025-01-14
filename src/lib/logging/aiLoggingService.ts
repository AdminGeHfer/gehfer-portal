import { supabase } from "@/integrations/supabase/client";

export interface AILogEvent {
  event_id: string;
  timestamp: string;
  agent_id: string;
  conversation_id: string;
  stage: AILogStage;
  details: Record<string, null>;
  metadata: {
    user_id: string;
    model_id: string;
    environment: 'prod' | 'dev';
  };
}

export enum AILogStage {
  INITIALIZATION = 'AGENT_INIT',
  QUERY_PROCESSING = 'QUERY_PROCESSING',
  KNOWLEDGE_SEARCH = 'KNOWLEDGE_BASE_SEARCH',
  EMBEDDING_GENERATION = 'EMBEDDING_GENERATION',
  DOCUMENT_MATCHING = 'DOCUMENT_MATCHING',
  PROMPT_CONSTRUCTION = 'PROMPT_CONSTRUCTION',
  MODEL_RESPONSE = 'MODEL_RESPONSE'
}

class AILoggingService {
  private static instance: AILoggingService;
  
  private constructor() {}

  public static getInstance(): AILoggingService {
    if (!AILoggingService.instance) {
      AILoggingService.instance = new AILoggingService();
    }
    return AILoggingService.instance;
  }

  async logEvent(event: Partial<AILogEvent>) {
    try {
      const finalEvent: AILogEvent = {
        event_id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ...event,
      } as AILogEvent;

      console.log('Logging AI event:', {
        stage: finalEvent.stage,
        conversation_id: finalEvent.conversation_id,
        details: finalEvent.details
      });

      const { error } = await supabase
        .from('ai_agent_logs')
        .insert({
          agent_id: finalEvent.agent_id,
          conversation_id: finalEvent.conversation_id,
          event_type: finalEvent.stage,
          configuration: finalEvent.details,
          details: JSON.stringify(finalEvent.metadata)
        });

      if (error) {
        console.error('Error logging AI event:', error);
      }
    } catch (error) {
      console.error('Error in logEvent:', error);
    }
  }
}

export const aiLogger = AILoggingService.getInstance();