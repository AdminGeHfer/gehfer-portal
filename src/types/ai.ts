export interface Message {
  id: string;
  conversation_id: string;
  role: 'system' | 'assistant' | 'user';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}