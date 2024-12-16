import { Json } from './json';

export interface DocumentTypes {
  documents: {
    Row: {
      id: string;
      content: string | null;
      metadata: Json | null;
      embedding: string | null;
      created_at: string | null;
      created_by: string | null;
      chunk_size: number | null;
      chunk_overlap: number | null;
      processed: boolean | null;
    };
    Insert: {
      id?: string;
      content?: string | null;
      metadata?: Json | null;
      embedding?: string | null;
      created_at?: string | null;
      created_by?: string | null;
      chunk_size?: number | null;
      chunk_overlap?: number | null;
      processed?: boolean | null;
    };
    Update: {
      id?: string;
      content?: string | null;
      metadata?: Json | null;
      embedding?: string | null;
      created_at?: string | null;
      created_by?: string | null;
      chunk_size?: number | null;
      chunk_overlap?: number | null;
      processed?: boolean | null;
    };
  };
  document_versions: {
    Row: {
      id: string;
      document_id: string | null;
      version_number: number;
      created_at: string;
      created_by: string | null;
      metadata: Json | null;
      is_active: boolean | null;
    };
    Insert: {
      id?: string;
      document_id?: string | null;
      version_number: number;
      created_at?: string;
      created_by?: string | null;
      metadata?: Json | null;
      is_active?: boolean | null;
    };
    Update: {
      id?: string;
      document_id?: string | null;
      version_number?: number;
      created_at?: string;
      created_by?: string | null;
      metadata?: Json | null;
      is_active?: boolean | null;
    };
  };
  document_chunks: {
    Row: {
      id: string;
      document_id: string | null;
      content: string;
      embedding: string | null;
      metadata: Json;
      created_at: string;
      created_by: string | null;
      semantic_context: string | null;
      topic: string | null;
      coherence_score: number | null;
      version_id: string | null;
    };
    Insert: {
      id?: string;
      document_id?: string | null;
      content: string;
      embedding?: string | null;
      metadata: Json;
      created_at?: string;
      created_by?: string | null;
      semantic_context?: string | null;
      topic?: string | null;
      coherence_score?: number | null;
      version_id?: string | null;
    };
    Update: {
      id?: string;
      document_id?: string | null;
      content?: string;
      embedding?: string | null;
      metadata?: Json;
      created_at?: string;
      created_by?: string | null;
      semantic_context?: string | null;
      topic?: string | null;
      coherence_score?: number | null;
      version_id?: string | null;
    };
  };
}