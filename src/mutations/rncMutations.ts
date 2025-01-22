import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNC } from "@/types/rnc";
import { toast } from "sonner";

export const useDeleteRNC = (id: string, onSuccess: () => void) => {
  return useMutation({
    mutationFn: async () => {
      console.log('Starting RNC deletion process for ID:', id);
      const { error } = await supabase
        .from("rncs")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting RNC:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("RNC excluída com sucesso");
      onSuccess();
    },
    onError: (error: Error) => {
      console.error("Error in useDeleteRNC:", error);
      toast.error("Erro ao excluir RNC: " + error.message);
    },
  });
};

export const useUpdateRNC = (
  id: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  return useMutation({
    mutationFn: async (updatedData: Partial<RNC>) => {
      console.log('Starting RNC update with data:', updatedData);

      // First update the RNC
      const { data: rncUpdateResult, error: rncError } = await supabase
        .from("rncs")
        .update({
          description: updatedData.description,
          type: updatedData.type,
          company: updatedData.company,
          cnpj: updatedData.cnpj,
          workflow_status: updatedData.workflow_status,
          department: updatedData.department,
          assigned_to: updatedData.assigned_to,
          assigned_by: updatedData.assigned_by,
          assigned_at: updatedData.assigned_at,
          closed_at: updatedData.closed_at,
          conclusion: updatedData.conclusion,
          korp: updatedData.korp,
          nfd: updatedData.nfd || null,  // Ensure null is used for empty values
          nfv: updatedData.nfv,
          city: updatedData.city,
          responsible: updatedData.responsible,
          days_left: updatedData.days_left,
          company_code: updatedData.company_code
        })
        .eq("id", id)
        .select();

      if (rncError) {
        console.error("Error updating RNC:", rncError);
        throw rncError;
      }

      console.log('RNC update result:', rncUpdateResult);

      // Then handle products if they exist
      if (updatedData.products && updatedData.products.length > 0) {
        console.log('Starting products update:', updatedData.products);
        
        // First delete existing products
        const { error: deleteError } = await supabase
          .from("rnc_products")
          .delete()
          .eq("rnc_id", id);

        if (deleteError) {
          console.error("Error deleting existing products:", deleteError);
          throw deleteError;
        }

        // Then insert new products
        const { data: productsResult, error: productsError } = await supabase
          .from("rnc_products")
          .insert(
            updatedData.products.map(product => ({
              rnc_id: id,
              product: product.product,
              weight: product.weight
            }))
          )
          .select();

        if (productsError) {
          console.error("Error inserting new products:", productsError);
          throw productsError;
        }

        console.log('Products update result:', productsResult);
      }

      // Finally handle contact if it exists
      if (updatedData.contact) {
        console.log('Starting contact update with data:', updatedData.contact);
        
        // First get the contact ID
        const { data: existingContact, error: contactFetchError } = await supabase
          .from("rnc_contacts")
          .select('id')
          .eq("rnc_id", id)
          .single();

        if (contactFetchError) {
          console.error("Error fetching existing contact:", contactFetchError);
          throw contactFetchError;
        }

        let contactResult;
        if (existingContact) {
          // Update existing contact
          const { data, error: contactError } = await supabase
            .from("rnc_contacts")
            .update({
              name: updatedData.contact.name,
              phone: updatedData.contact.phone,
              email: updatedData.contact.email
            })
            .eq("id", existingContact.id)
            .select();

          if (contactError) {
            console.error("Error updating contact:", contactError);
            throw contactError;
          }
          contactResult = data;
        } else {
          // Insert new contact
          const { data, error: contactError } = await supabase
            .from("rnc_contacts")
            .insert({
              rnc_id: id,
              name: updatedData.contact.name,
              phone: updatedData.contact.phone,
              email: updatedData.contact.email
            })
            .select();

          if (contactError) {
            console.error("Error inserting contact:", contactError);
            throw contactError;
          }
          contactResult = data;
        }

        console.log('Contact update/insert result:', contactResult);
      }
    },
    onSuccess: () => {
      toast.success("RNC atualizada com sucesso");
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Erro ao atualizar RNC: " + error.message);
      if (onError) onError(error);
    },
  });
};