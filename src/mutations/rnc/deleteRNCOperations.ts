import { supabase } from "@/integrations/supabase/client";

const handleError = (error: any, operation: string) => {
  console.error(`Error in ${operation}:`, error);
  throw error;
};

export const deleteRNCProducts = async (id: string) => {
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
    handleError(error, 'deleteRNCProducts');
  }
};

export const deleteRNCContacts = async (id: string) => {
  try {
    console.log('Attempting to delete contacts for RNC:', id);
    const { error } = await supabase
      .from("rnc_contacts")
      .delete()
      .eq("rnc_id", id);
    
    if (error) throw error;
    console.log('Successfully deleted contacts');
    return true;
  } catch (error) {
    handleError(error, 'deleteRNCContacts');
  }
};

export const deleteRNCEvents = async (id: string) => {
  try {
    console.log('Attempting to delete events for RNC:', id);
    const { error } = await supabase
      .from("rnc_events")
      .delete()
      .eq("rnc_id", id);
    
    if (error) throw error;
    console.log('Successfully deleted events');
    return true;
  } catch (error) {
    handleError(error, 'deleteRNCEvents');
  }
};

export const deleteRNCWorkflowTransitions = async (id: string) => {
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
    handleError(error, 'deleteRNCWorkflowTransitions');
  }
};

export const deleteRNCNotifications = async (id: string) => {
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
    handleError(error, 'deleteRNCNotifications');
  }
};

export const deleteRNCRecord = async (id: string) => {
  try {
    console.log('Starting RNC deletion process for ID:', id);
    
    // Delete all related records in the correct order
    await deleteRNCProducts(id);
    await deleteRNCContacts(id);
    await deleteRNCEvents(id);
    await deleteRNCWorkflowTransitions(id);
    await deleteRNCNotifications(id);
    
    // Finally delete the RNC itself
    const { error } = await supabase
      .from("rncs")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    console.log('Successfully deleted RNC and all related records');
    return true;
  } catch (error) {
    console.error('Error in deleteRNCRecord:', error);
    throw error;
  }
};