import { supabase } from "@/integrations/supabase/client";
import { RNC } from "@/types/rnc";
import { toast } from "sonner";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

export const useDeleteRNC = (id: string, onSuccess: () => void) => {
  return useMutation({
    mutationFn: async () => {
      // First delete related records
      const { error: contactsError } = await supabase
        .from("rnc_contacts")
        .delete()
        .eq("rnc_id", id);
      
      if (contactsError) throw contactsError;

      const { error: productsError } = await supabase
        .from("rnc_products")
        .delete()
        .eq("rnc_id", id);
      
      if (productsError) throw productsError;

      const { error: eventsError } = await supabase
        .from("rnc_events")
        .delete()
        .eq("rnc_id", id);
      
      if (eventsError) throw eventsError;

      const { error: attachmentsError } = await supabase
        .from("rnc_attachments")
        .delete()
        .eq("rnc_id", id);
      
      if (attachmentsError) throw attachmentsError;

      // Finally delete the RNC
      const { error } = await supabase
        .from("rncs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess,
    onError: (error: Error) => {
      toast.error("Erro ao excluir RNC: " + error.message);
    },
  });
};

type UpdateRNCMutationOptions = Omit<
  UseMutationOptions<void, Error, Partial<RNC>, unknown>,
  'mutationFn'
>;

export const useUpdateRNC = (id: string, options?: UpdateRNCMutationOptions) => {
  return useMutation({
    mutationFn: async (updatedData: Partial<RNC>) => {
      console.log("Updating RNC with data:", updatedData);
      
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

      if (rncError) {
        console.error("Error updating RNC:", rncError);
        throw rncError;
      }

      if (updatedData.products && updatedData.products.length > 0) {
        const { error: productsError } = await supabase
          .from('rnc_products')
          .insert(
            updatedData.products.map(product => ({
              rnc_id: product.rnc_id,
              product: product.product,
              weight: product.weight
            }))
          );
  
        if (productsError) throw productsError;
      }

      if (updatedData.contact) {
        const { error: contactError } = await supabase
          .from("rnc_contacts")
          .update({
            name: updatedData.contact.name,
            phone: updatedData.contact.phone,
            email: updatedData.contact.email,
            rnc_id: id
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
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error: Error, variables, context) => {
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};