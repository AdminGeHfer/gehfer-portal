export interface DocumentMetadata {
  filename: string;
  contentType: string;
  size: number;
  path?: string;
  version?: string;
  processor?: string;
  chunkCount?: number;
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
    metadata: DocumentMetadata;
    created_at: string;
  };
}