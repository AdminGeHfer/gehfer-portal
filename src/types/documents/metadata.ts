import { Json } from '@/integrations/supabase/types/json';

export interface DocumentMetadata {
  filename: string;
  contentType: string;
  size: number;
  path?: string;
  version?: string;
  processor?: string;
  chunkCount?: number;
  [key: string]: string | number | undefined; // Add index signature
}

export interface Document {
  id: string;
  filename: string;
  created_at: string;
}

export interface DocumentResponse {
  document_id: string;
  documents: {
    id: string;
    metadata: Json;
    created_at: string;
  };
}