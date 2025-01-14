import { supabase } from "@/integrations/supabase/client";

export interface SearchResult {
  id: string;
  content: string;
  metadata;
  similarity: number;
}

export const searchDocuments = async (
  query: string,
  limit: number = 5,
  threshold: number = 0.7
): Promise<SearchResult[]> => {
  try {
    const { data: results, error } = await supabase.functions.invoke('semantic-search', {
      body: { query, limit, threshold }
    });

    if (error) throw error;
    return results;
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
};

export const processSearchResults = (results: SearchResult[]) => {
  return results.map(result => ({
    ...result,
    content: result.content.trim(),
    citation: `Source: ${result.metadata?.filename || 'Unknown'}`
  }));
};