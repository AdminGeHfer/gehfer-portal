import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNC } from "@/types/rnc";

export const useUpdateRNC = (
  id: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  return useMutation<void, Error, Partial<RNC>>({
    mutationFn: async (updatedData: Partial<RNC>) => {
      console.log('Starting RNC update with data:', updatedData);

      // First update the RNC
      const { error: rncError } = await supabase
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
          nfd: updatedData.nfd,
          nfv: updatedData.nfv,
          city: updatedData.city,
          responsible: updatedData.responsible,
          days_left: updatedData.days_left
        })
        .eq("id", id);

      if (rncError) {
        console.error("Error updating RNC:", rncError);
        throw rncError;
      }

      // Then handle products if they exist
      if (updatedData.products && updatedData.products.length > 0) {
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
        const { error: productsError } = await supabase
          .from("rnc_products")
          .insert(
            updatedData.products.map(product => ({
              rnc_id: id,
              product: product.product,
              weight: product.weight
            }))
          );

        if (productsError) {
          console.error("Error inserting new products:", productsError);
          throw productsError;
        }
      }

      // Finally handle contact if it exists
      if (updatedData.contact) {
        const { error: contactError } = await supabase
          .from("rnc_contacts")
          .update({
            name: updatedData.contact.name,
            phone: updatedData.contact.phone,
            email: updatedData.contact.email
          })
          .eq("rnc_id", id);

        if (contactError) {
          console.error("Error updating contact:", contactError);
          throw contactError;
        }
      }
    },
    onSuccess,
    onError: (error) => {
      console.error("Mutation error:", error);
      if (onError) onError(error);
    },
  });
};