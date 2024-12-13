import { supabase } from "@/integrations/supabase/client";

export interface SearchAnalytics {
  totalSearches: number;
  averageSimilarity: number;
  topQueries: { query: string; count: number }[];
}

interface LogConfiguration {
  resultsCount: number;
  averageSimilarity: number;
  timestamp: string;
}

export const logSearchQuery = async (
  query: string,
  results: any[],
  agentId?: string
) => {
  try {
    const averageSimilarity = results.reduce((acc, r) => acc + (r.similarity || 0), 0) / results.length;
    
    await supabase.from('ai_agent_logs').insert({
      agent_id: agentId,
      event_type: 'knowledge_search',
      details: query,
      configuration: {
        resultsCount: results.length,
        averageSimilarity,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error logging search query:', error);
  }
};

export const getSearchAnalytics = async (agentId?: string): Promise<SearchAnalytics> => {
  const { data: logs, error } = await supabase
    .from('ai_agent_logs')
    .select('*')
    .eq('event_type', 'knowledge_search')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const queries = logs.map(log => log.details);
  const similarities = logs.map(log => {
    if (!log.configuration || typeof log.configuration !== 'object') return 0;
    
    // Type guard to check if the configuration has the required properties
    const isLogConfig = (config: any): config is LogConfiguration => {
      return (
        'averageSimilarity' in config &&
        typeof config.averageSimilarity === 'number'
      );
    };

    const config = log.configuration;
    return isLogConfig(config) ? config.averageSimilarity : 0;
  });

  const queryCount: Record<string, number> = {};
  queries.forEach(q => {
    queryCount[q] = (queryCount[q] || 0) + 1;
  });

  const topQueries = Object.entries(queryCount)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalSearches: logs.length,
    averageSimilarity: similarities.reduce((a, b) => a + b, 0) / similarities.length,
    topQueries
  };
};