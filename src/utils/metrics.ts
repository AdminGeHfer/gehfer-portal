import { supabase } from "@/integrations/supabase/client";

export interface ChatMetrics {
  responseTime: number;
  contextMaintained: boolean;
  userSatisfaction?: number;
  interactionsToResolve: number;
  classification?: {
    accuracy: number;
    confidence: number;
  };
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
        configuration: metrics
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

    return data.reduce((acc: any, curr: any) => {
      const metrics = curr.configuration;
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