import { supabase } from "@/integrations/supabase/client";

export interface AuditEvent {
  action: string;
  resourceType: string;
  resourceId: string;
  details?: Record<string, any>;
}

export async function logAuditEvent(event: AuditEvent) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return;
    }

    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: event.action,
        resource_type: event.resourceType,
        resource_id: event.resourceId,
        details: event.details
      });

    if (error) {
      console.error('Error logging audit event:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in logAuditEvent:', error);
    throw error;
  }
}