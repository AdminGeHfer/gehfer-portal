export interface Message {
  id?: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export interface ChatResponse {
  message: string;
  conversation_id: string;
  error?: string;
}