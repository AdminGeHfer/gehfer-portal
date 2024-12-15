export interface AIAgent {
  id: string;
  name: string;
  description?: string;
  model_id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  agent_type?: string;
  icon?: string;
  color?: string;
}