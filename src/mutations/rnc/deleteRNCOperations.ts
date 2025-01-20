import { supabase } from "@/integrations/supabase/client";

const handleError = (error, operation: string) => {
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

export const deleteProducts = async (id: string) => {
  try {
    console.log('Attempting to delete products for RNC:', id);
    const { error } = await supabase
      .from("rnc_products")
      .delete()
      .eq("rnc_id", id);
    
    if (error) throw error;
    console.log('Successfully deleted products');
    return true;
  } catch (error) {
    handleError(error, 'deleteProducts');
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
    await deleteProducts(id);  // Movido para antes da deleção da RNC
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
  } catch (error) {
    // If RNC not found, return true to indicate it's already deleted
    if (error.message === "RNC not found") {
      console.log('RNC already deleted');
      return true;
    }
    console.error('Error in deleteRNCRecord:', error);
    throw error;
  }
};