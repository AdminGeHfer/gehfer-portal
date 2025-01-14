import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface ChatMetrics {
  responseTime: number;
  contextMaintained: boolean;
  userSatisfaction?: number;
  interactionsToResolve: number;
  classification?: {
    accuracy: number;
    confidence: number;
  };
  [key: string]: number | boolean | string | object; // Add index signature to make it compatible with Json type
}

export const trackMetrics = async (
  conversationId: string,
  metrics: ChatMetrics
) => {
  try {
    const { error } = await supabase
      .from('ai_agent_logs')
      .insert({
        conversation_id: conversationId,
        event_type: 'metrics',
        configuration: metrics as unknown as Json // Type assertion needed for Supabase
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking metrics:', error);
  }
};

export const analyzeMetrics = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('ai_agent_logs')
      .select('configuration')
      .eq('conversation_id', conversationId)
      .eq('event_type', 'metrics');

    if (error) throw error;

    return data.reduce((acc: { [key: string]: number }, curr: { configuration: Json }) => {
      const metrics = curr.configuration as ChatMetrics;
      return {
        avgResponseTime: (acc.avgResponseTime || 0) + metrics.responseTime / data.length,
        contextRetention: (acc.contextRetention || 0) + (metrics.contextMaintained ? 1 : 0) / data.length,
        avgInteractions: (acc.avgInteractions || 0) + metrics.interactionsToResolve / data.length,
        classificationAccuracy: metrics.classification 
          ? (acc.classificationAccuracy || 0) + metrics.classification.accuracy / data.length
          : acc.classificationAccuracy
      };
    }, {});
  } catch (error) {
    console.error('Error analyzing metrics:', error);
    return null;
  }
};