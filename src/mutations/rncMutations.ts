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
          description: updatedData.description,
          workflow_status: updatedData.workflow_status,
          priority: updatedData.priority,
          type: updatedData.type,
          department: updatedData.department,
          company: updatedData.company,
          cnpj: updatedData.cnpj,
          order_number: updatedData.order_number || null,
          return_number: updatedData.return_number || null,
          resolution: updatedData.resolution,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (rncError) {
        console.error("Error updating RNC:", rncError);
        throw rncError;
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