import { supabase } from "@/integrations/supabase/client";

class RNCDeleteOperations {
 /**
   * Executes a delete operation on the specified table filtered by rnc_id.
   * @param {string} tableName - Name of the table to delete from.
   * @param {string} rncId - ID of the RNC to delete.
   * @returns {Promise<{success: boolean, error?: Error}>}
   */
 static async executeDelete(tableName, rncId) {
  try {
    console.log(`Deleting from ${tableName} for RNC ID: ${rncId}`);
    const column = tableName === "rncs" ? "id" : "rnc_id";
    const { error } = await supabase.from(tableName).delete().eq(column, rncId);

    if (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      return { success: false, error };
    }

    console.log(`Successfully deleted from ${tableName}`);
    return { success: true };
  } catch (error) {
    console.error(`Unexpected error during deletion from ${tableName}:`, error);
    return { success: false, error };
  }
}

  /**
   * Deletes all records related to the specified RNC ID in the correct order.
   * @param {string} rncId - ID of the RNC to delete.
   * @returns {Promise<boolean>} - Indicates whether the operation was successful.
   */
  static async deleteRNCAndRelatedRecords(rncId) {
    console.log(`Starting deletion process for RNC ID: ${rncId}`);

    // Define the deletion sequence based on foreign key dependencies
    const tablesToDelete = [
      "rnc_workflow_transitions",
      "rnc_attachments",
      "rnc_events",
      "rnc_contacts",
      "rnc_products",
      "rncs", // Must be last to delete the main RNC record
    ];

    for (const table of tablesToDelete) {
      const result = await this.executeDelete(table, rncId);
      if (!result.success) {
        console.error(`Failed to delete records from ${table}:`, result.error);
        throw result.error;
      }
    }

    console.log(`Successfully deleted RNC and all related records for ID: ${rncId}`);
    return true;
  }
}

export async function deleteRNCRecord(rncId) {
  try {
    return await RNCDeleteOperations.deleteRNCAndRelatedRecords(rncId);
  } catch (error) {
    console.error("Deletion process failed:", error);
    return false;
  }
}
