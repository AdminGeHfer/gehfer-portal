export interface DocumentMetadata {
  title?: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
  file_type?: string;
  file_size?: number;
  page_count?: number;
  source?: string;
  tags?: string[];
  category?: string;
  custom_fields?: Record<string, any>;
}