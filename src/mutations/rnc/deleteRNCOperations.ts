import { supabase } from "@/integrations/supabase/client";

const handleError = (error: any, operation: string) => {
  console.error(`Error in ${operation}:`, error);
  throw error;
};

export const deleteWorkflowTransitions = async (id: string) => {
  try {
    console.log('Attempting to delete workflow transitions for RNC:', id);
    const { error } = await supabase
      .from("rnc_workflow_transitions")
      .delete()
      .eq("rnc_id", id);

    if (error) throw error;
    console.log('Successfully deleted workflow transitions');
    return true;
  } catch (error) {
    handleError(error, 'deleteWorkflowTransitions');
  }
};

export const deleteNotifications = async (id: string) => {
  try {
    console.log('Attempting to delete notifications for RNC:', id);
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("rnc_id", id);

    if (error) throw error;
    console.log('Successfully deleted notifications');
    return true;
  } catch (error) {
    handleError(error, 'deleteNotifications');
  }
};

export const deleteCollectionData = async (id: string) => {
  try {
    console.log('Attempting to delete collection data for RNC:', id);
    
    // First get all collections for this RNC
    const { data: collections, error: collectionsError } = await supabase
      .from("collection_requests")
      .select("id")
      .eq("rnc_id", id);

    if (collectionsError) throw collectionsError;

    if (collections && collections.length > 0) {
      // Delete all evidence records first
      for (const collection of collections) {
        const { error: evidenceError } = await supabase
          .from("collection_evidence")
          .delete()
          .eq("collection_id", collection.id);
        
        if (evidenceError) {
          console.error(`Error deleting evidence for collection ${collection.id}:`, evidenceError);
          throw evidenceError;
        }
      }

      // Then delete all return items
      for (const collection of collections) {
        const { error: returnItemsError } = await supabase
          .from("return_items")
          .delete()
          .eq("collection_id", collection.id);
        
        if (returnItemsError) {
          console.error(`Error deleting return items for collection ${collection.id}:`, returnItemsError);
          throw returnItemsError;
        }
      }

      // Finally delete the collections themselves
      const { error: collectionsDeleteError } = await supabase
        .from("collection_requests")
        .delete()
        .eq("rnc_id", id);
      
      if (collectionsDeleteError) {
        console.error('Error deleting collections:', collectionsDeleteError);
        throw collectionsDeleteError;
      }
    }

    return true;
  } catch (error) {
    handleError(error, 'deleteCollectionData');
  }
};

export const deleteContacts = async (id: string) => {
  try {
    console.log('Attempting to delete contacts for RNC:', id);
    const { error } = await supabase
      .from("rnc_contacts")
      .delete()
      .eq("rnc_id", id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'deleteContacts');
  }
};

export const deleteEvents = async (id: string) => {
  try {
    console.log('Attempting to delete events for RNC:', id);
    const { error } = await supabase
      .from("rnc_events")
      .delete()
      .eq("rnc_id", id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleError(error, 'deleteEvents');
  }
};

export const deleteRNCRecord = async (id: string) => {
  try {
    console.log('Starting RNC deletion process for ID:', id);
    
    // Check if RNC exists first
    const { data: rnc, error: rncError } = await supabase
      .from("rncs")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (rncError) throw rncError;
    if (!rnc) {
      throw new Error("RNC not found");
    }
    
    // Delete in order of dependencies
    await deleteWorkflowTransitions(id);
    await deleteNotifications(id);
    await deleteCollectionData(id);
    await deleteContacts(id);
    await deleteEvents(id);
    
    // Finally delete the RNC itself
    const { error } = await supabase
      .from("rncs")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    console.log('Successfully deleted RNC and all related records');
    return true;
  } catch (error: any) {
    // If RNC not found, return true to indicate it's already deleted
    if (error.message === "RNC not found") {
      console.log('RNC already deleted');
      return true;
    }
    console.error('Error in deleteRNCRecord:', error);
    throw error;
  }
};