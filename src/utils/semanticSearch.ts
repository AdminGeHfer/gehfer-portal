import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  content: string;
  similarity: number;
  metadata: any;
}

export async function semanticSearch(
  embedding: number[],
  match_threshold: number = 0.7,
  match_count: number = 5
): Promise<SearchResult[]> {
  const { data: chunks, error } = await supabase
    .rpc('match_documents', {
      query_embedding: embedding,
      match_threshold,
      match_count
    });

  if (error) throw error;
  return chunks || [];
}