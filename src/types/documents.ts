export interface DocumentVersionMetadata {
  chunks_count: number;
  avg_coherence: number;
  processed_at?: string;
  processor_version?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  created_at: string;
  metadata: DocumentVersionMetadata;
  is_active: boolean;
  profiles?: {
    name: string;
  };
}