import { supabase } from "@/integrations/supabase/client";
import { RNC } from "@/types/rnc";

// Update function signature to include products
const updateRNCData = async (id: string, updatedData: Partial<RNC>) => {
  const { error: rncError } = await supabase
    .from("rncs")
    .update({
      company_code: updatedData.company_code,
      company: updatedData.company,
      cnpj: updatedData.cnpj,
      type: updatedData.type,
      description: updatedData.description,
      responsible: updatedData.responsible,
      days_left: updatedData.days_left,
      korp: updatedData.korp,
      nfv: updatedData.nfv,
      nfd: updatedData.nfd,
      collected_at: updatedData.collected_at,
      closed_at: updatedData.closed_at,
      city: updatedData.city,
      conclusion: updatedData.conclusion,
      department: updatedData.department,
      assigned_at: updatedData.assigned_at,
      workflow_status: updatedData.workflow_status,
      assigned_to: updatedData.assigned_to,
      assigned_by: updatedData.assigned_by,
      created_by: updatedData.created_by,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (rncError) throw rncError;

  // Handle products if provided
  if (updatedData.products) {
    // First delete existing products
    const { error: deleteError } = await supabase
      .from("rnc_products")
      .delete()
      .eq("rnc_id", id);

    if (deleteError) throw deleteError;

    // Then insert new products if any
    if (updatedData.products.length > 0) {
      const { error: productsError } = await supabase
        .from("rnc_products")
        .insert(
          updatedData.products.map(product => ({
            rnc_id: id,
            product: product.product,
            weight: product.weight
          }))
        );

      if (productsError) throw productsError;
    }
  }
};

const updateRNCContact = async (id: string, contact: RNC['contact']) => {
  if (!contact) return;

  const { error: contactError } = await supabase
    .from("rnc_contacts")
    .update({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      rnc_id: id
    })
    .eq("rnc_id", id);

  if (contactError) throw contactError;
};

export const updateRNCRecord = async (id: string, updatedData: Partial<RNC>) => {
  try {
    await updateRNCData(id, updatedData);
    if (updatedData.contact) {
      await updateRNCContact(id, updatedData.contact);
    }
    return true;
  } catch (error) {
    console.error("Update operation failed:", error);
    throw new Error(error.message || "Failed to update RNC");
  }
};