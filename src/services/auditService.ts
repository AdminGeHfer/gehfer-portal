import { supabase } from "@/integrations/supabase/client";

export type AuditAction = 'create' | 'update' | 'delete' | 'view';
export type EntityType = 'rnc' | 'user' | 'role' | 'permission';

export async function logAuditEvent(
  action: AuditAction,
  entityType: EntityType,
  entityId: string,
  oldValues?: any,
  newValues?: any
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldValues,
      new_values: newValues
    });
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}