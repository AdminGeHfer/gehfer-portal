export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  type?: 'workflow_state_update' | 'rnc_status' | 'system';
  rnc_id?: string;
}
