import { supabase } from "@/integrations/supabase/client";
import { RNC } from "@/types/rnc";
import { toast } from "sonner";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

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