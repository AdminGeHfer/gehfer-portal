import { supabase } from "@/integrations/supabase/client";
import { RNC } from "@/types/rnc";
import { toast } from "sonner";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

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
  options?: Partial<UseMutationOptions<void, Error, Partial<RNC>>>
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
    ...options,
    onSuccess: (data, variables, context) => {
      toast.success("RNC atualizada com sucesso");
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error: Error) => {
      console.error('Error in useUpdateRNC:', error);
      toast.error("Erro ao atualizar RNC: " + error.message);
      if (options?.onError) {
        options.onError(error, null, null);
      }
    },
  });
};