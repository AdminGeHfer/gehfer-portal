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

export const deleteRNCRecord = async (id: string) => {
  try {
    console.log('Starting RNC deletion process for ID:', id);
    
    // First delete all products associated with this RNC
    await deleteRNCProducts(id);
    
    // Then delete the RNC itself
    const { error } = await supabase
      .from("rncs")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    console.log('Successfully deleted RNC');
    return true;
  } catch (error) {
    console.error('Error in deleteRNCRecord:', error);
    throw error;
  }
};