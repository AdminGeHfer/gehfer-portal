export type CollectionStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface CollectionRequest {
  id: string;
  rnc_id: string;
  collection_address: string;
  status: CollectionStatus;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  completed_by?: string;
  evidence?: CollectionEvidence[];
  return_items?: ReturnItem[];
}

export interface CollectionEvidence {
  id: string;
  collection_id: string;
  filename: string;
  filesize: number;
  content_type: string;
  file_path: string;
  evidence_type: string;
  created_by: string;
  created_at: string;
}

export interface CollectionFormData {
  collection_address: string;
  notes?: string;
}

export interface ReturnItem {
  id: string;
  collection_id: string;
  product_id: string;
  weight: number;
  created_at: string;
  created_by?: string;
  product?: {
    id: string;
    name: string;
    description?: string;
    internal_code: string;
  };
}