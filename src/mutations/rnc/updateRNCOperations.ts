import { supabase } from "@/integrations/supabase/client";
import { RNC } from "@/types/rnc";

const updateRNCData = async (id: string, updatedData: Partial<RNC>) => {
  const { error: rncError } = await supabase
    .from("rncs")
    .update({
      rnc_number: updatedData.rnc_number,
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
};

const updateRNCProduct = async (id: string, product: RNC['product']) => {
  if (!product) return;

  const { error: productError } = await supabase
    .from("rnc_products")
    .update({
      product: product.product,
      weight: product.weight,
      rnc_id: id
    })
    .eq("rnc_id", id);

  if (productError) throw productError;
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

    if (updateRNCData.products) {
      await updateRNCProduct(id, updatedData.products);
    }
    return true;
  } catch (error) {
    console.error("Update operation failed:", error);
    throw new Error(error.message || "Failed to update RNC");
  }
};