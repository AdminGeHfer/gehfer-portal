import { supabase } from "@/integrations/supabase/client";

export interface AuditLog {
  id?: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details?: any;
  created_at?: string;
}

export async function logAction(action: string, resourceType: string, resourceId: string, details?: any) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error("No user found when trying to log action");
    return;
  }

  try {
    console.log("Logging action:", { action, resourceType, resourceId, details });
    
    // For now, we'll just log to console since the audit_logs table isn't ready
    // When the table is created, uncomment the code below
    
    /*
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details
      });

    if (error) throw error;
    */
    
  } catch (error) {
    console.error("Error logging action:", error);
  }
}