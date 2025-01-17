import { supabase } from "@/integrations/supabase/client";
import { RNC, RNCFormData, RNCTypeEnum } from "@/types/rnc";
import { toast } from "sonner";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

export const useDeleteRNC = (id: string, onSuccess: () => void) => {
  return useMutation({
    mutationFn: async () => {
      // First delete products
      const { error: productsError } = await supabase
        .from("rnc_products")
        .delete()
        .eq("rnc_id", id);

      if (productsError) throw productsError;

      // Then delete contacts
      const { error: contactError } = await supabase
        .from("rnc_contacts")
        .delete()
        .eq("rnc_id", id);

      if (contactError) throw contactError;

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

export const useUpdateRNC = (
  id: string,
  options?: Partial<UseMutationOptions<void, Error, Partial<RNC>>>
) => {
  return useMutation({
    mutationFn: async (updatedData: Partial<RNC>) => {
      // Update RNC
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
          order_number: updatedData.order_number,
          return_number: updatedData.return_number,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (rncError) throw rncError;

      // Handle products update if provided
      if (updatedData.products) {
        // Delete existing products
        const { error: deleteError } = await supabase
          .from("rnc_products")
          .delete()
          .eq("rnc_id", id);

        if (deleteError) throw deleteError;

        // Insert new products
        if (updatedData.products.length > 0) {
          const { error: productsError } = await supabase
            .from("rnc_products")
            .insert(
              updatedData.products.map(product => ({
                rnc_id: id,
                product: product.name,
                weight: product.weight
              }))
            );

          if (productsError) throw productsError;
        }
      }

      // Update contact if provided
      if (updatedData.contact) {
        const { error: contactError } = await supabase
          .from("rnc_contacts")
          .update({
            name: updatedData.contact.name,
            phone: updatedData.contact.phone,
            email: updatedData.contact.email,
          })
          .eq("rnc_id", id);

        if (contactError) throw contactError;
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
      toast.error("Erro ao atualizar RNC: " + error.message);
      if (options?.onError) {
        options.onError(error, null, null);
      }
    },
  });
};

export const useCreateRNC = (options?: Partial<UseMutationOptions<string, Error, RNCFormData>>) => {
  return useMutation({
    mutationFn: async (data: RNCFormData) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");

      // Create RNC
      const { data: rnc, error: rncError } = await supabase
        .from("rncs")
        .insert({
          description: data.description,
          workflow_status: "open",
          priority: data.priority,
          type: data.type,
          department: data.department,
          company: data.company,
          cnpj: data.cnpj,
          order_number: data.order_number,
          return_number: data.return_number,
          created_by: user.user.id
        })
        .select()
        .single();

      if (rncError) throw rncError;

      // Create contact
      const { error: contactError } = await supabase
        .from("rnc_contacts")
        .insert({
          rnc_id: rnc.id,
          name: data.contact.name,
          phone: data.contact.phone,
          email: data.contact.email,
        });

      if (contactError) throw contactError;

      // Create products if provided
      if (data.products?.length > 0) {
        const { error: productsError } = await supabase
          .from("rnc_products")
          .insert(
            data.products.map(product => ({
              rnc_id: rnc.id,
              product: product.name,
              weight: product.weight
            }))
          );

        if (productsError) throw productsError;
      }

      return rnc.id;
    },
    ...options,
    onSuccess: (data, variables, context) => {
      toast.success("RNC criada com sucesso");
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar RNC: " + error.message);
      if (options?.onError) {
        options.onError(error, null, null);
      }
    },
  });
};