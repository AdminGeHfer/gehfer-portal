import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RNC } from "@/types/rnc";
import { toast } from "sonner";

export const useDeleteRNC = (id: string, onSuccess: () => void) => {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("rncs")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("RNC excluída com sucesso");
      onSuccess();
    },
    onError: (error: Error) => {
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
          nfd: updatedData.nfd || null,
          nfv: updatedData.nfv,
          city: updatedData.city,
          responsible: updatedData.responsible,
          days_left: updatedData.days_left,
          company_code: updatedData.company_code
        })
        .eq("id", id);

      if (rncError) {
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
          throw productsError;
        }
      }

      // Finally handle contact if it exists
      if (updatedData.contact) {
        // First get the contact ID
        const { data: existingContact, error: contactFetchError } = await supabase
          .from("rnc_contacts")
          .select('id')
          .eq("rnc_id", id)
          .single();

        if (contactFetchError && contactFetchError.code !== 'PGRST116') {
          throw contactFetchError;
        }

        if (existingContact) {
          // Update existing contact
          const { error: contactError } = await supabase
            .from("rnc_contacts")
            .update({
              name: updatedData.contact.name,
              phone: updatedData.contact.phone,
              email: updatedData.contact.email
            })
            .eq("id", existingContact.id);

          if (contactError) {
            throw contactError;
          }
        } else {
          // Insert new contact
          const { error: contactError } = await supabase
            .from("rnc_contacts")
            .insert({
              rnc_id: id,
              name: updatedData.contact.name,
              phone: updatedData.contact.phone,
              email: updatedData.contact.email
            });

          if (contactError) {
            throw contactError;
          }
        }
      }
    },
    onSuccess: () => {
      toast.success("RNC atualizada com sucesso");
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar RNC: " + error.message);
      if (onError) onError(error);
    },
  });
};