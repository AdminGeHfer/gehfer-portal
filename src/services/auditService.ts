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

export const logAuditEvent = async (
  action: string,
  resourceType: string,
  resourceId: string,
  oldData: any = null,
  newData: any = null
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error("No user found when trying to log action");
    return;
  }

  try {
    console.log("Logging action:", { action, resourceType, resourceId, oldData, newData });
    
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: {
          old: oldData,
          new: newData
        }
      });

    if (error) throw error;
    
  } catch (error) {
    console.error("Error logging action:", error);
  }
};