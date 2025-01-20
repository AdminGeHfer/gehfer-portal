import { supabase } from "@/integrations/supabase/client";

type RNCRelatedTable = 
  | "rnc_products"
  | "rnc_contacts"
  | "rnc_events"
  | "rnc_workflow_transitions"
  | "notifications"
  | "rncs";

interface DeleteOperationResult {
  success: boolean;
  error?: Error;
}

class RNCDeleteOperations {
  private static async executeDelete(
    tableName: RNCRelatedTable,
    rncId: string
  ): Promise<DeleteOperationResult> {
    try {
      console.log(`Attempting to delete records from ${tableName} for RNC:`, rncId);
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("rnc_id", rncId);

      if (error) {
        console.error(`Error deleting from ${tableName}:`, error);
        return { success: false, error: error };
      }

      console.log(`Successfully deleted records from ${tableName}`);
      return { success: true };
    } catch (error) {
      console.error(`Error in ${tableName} deletion:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error(`Failed to delete from ${tableName}`) 
      };
    }
  }

  static async deleteProducts(rncId: string): Promise<DeleteOperationResult> {
    return this.executeDelete("rnc_products", rncId);
  }

  static async deleteContacts(rncId: string): Promise<DeleteOperationResult> {
    return this.executeDelete("rnc_contacts", rncId);
  }

  static async deleteEvents(rncId: string): Promise<DeleteOperationResult> {
    return this.executeDelete("rnc_events", rncId);
  }

  static async deleteWorkflowTransitions(rncId: string): Promise<DeleteOperationResult> {
    return this.executeDelete("rnc_workflow_transitions", rncId);
  }

  static async deleteNotifications(rncId: string): Promise<DeleteOperationResult> {
    return this.executeDelete("notifications", rncId);
  }

  static async deleteRNC(rncId: string): Promise<DeleteOperationResult> {
    try {
      console.log('Attempting to delete RNC:', rncId);
      const { error } = await supabase
        .from("rncs")
        .delete()
        .eq("id", rncId);

      if (error) {
        console.error('Error deleting RNC:', error);
        return { success: false, error: error };
      }

      console.log('Successfully deleted RNC');
      return { success: true };
    } catch (error) {
      console.error('Error in RNC deletion:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Failed to delete RNC') 
      };
    }
  }
}

export async function deleteRNCRecord(id: string): Promise<boolean> {
  console.log('Starting RNC deletion process for ID:', id);

  // Define deletion order
  const deletionOperations = [
    { name: 'products', operation: () => RNCDeleteOperations.deleteProducts(id) },
    { name: 'contacts', operation: () => RNCDeleteOperations.deleteContacts(id) },
    { name: 'events', operation: () => RNCDeleteOperations.deleteEvents(id) },
    { name: 'workflow transitions', operation: () => RNCDeleteOperations.deleteWorkflowTransitions(id) },
    { name: 'notifications', operation: () => RNCDeleteOperations.deleteNotifications(id) },
    { name: 'RNC', operation: () => RNCDeleteOperations.deleteRNC(id) }
  ];

  // Execute deletions in sequence
  for (const { name, operation } of deletionOperations) {
    const result = await operation();
    if (!result.success) {
      console.error(`Failed to delete ${name}:`, result.error);
      throw result.error;
    }
  }

  console.log('Successfully completed all deletion operations');
  return true;
}