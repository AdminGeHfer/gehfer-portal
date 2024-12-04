import { supabase } from "@/integrations/supabase/client";
import { RNC } from "@/types/rnc";

const updateRNCData = async (id: string, updatedData: Partial<RNC>) => {
  const { error: rncError } = await supabase
    .from("rncs")
    .update({
      description: updatedData.description,
      workflow_status: updatedData.workflow_status,
      priority: updatedData.priority,
      type: updatedData.type,
      department: updatedData.department,
      company: updatedData.company,
      cnpj: updatedData.cnpj,
      order_number: updatedData.orderNumber,
      return_number: updatedData.returnNumber,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (rncError) throw rncError;
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
  } catch (error: any) {
    console.error("Update operation failed:", error);
    throw new Error(error.message || "Failed to update RNC");
  }
};