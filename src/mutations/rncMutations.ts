import { supabase } from "@/integrations/supabase/client";
import { RNC, RNCFormData } from "@/types/rnc";
import { toast } from "sonner";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

type RNCTypeEnum = "company_complaint" | "supplier" | "dispatch" | "logistics" | "deputy" | "driver" | "financial" | "commercial" | "financial_agreement";

export const useDeleteRNC = (id: string, onSuccess: () => void) => {
  return useMutation({
    mutationFn: async () => {
      // First delete products
      const { error: productsError } = await supabase
        .from("rnc_products")
        .delete()
        .eq("rnc_id", id);

      if (productsError) throw productsError;

      // Then delete the RNC
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
          rnc_number: updatedData.rnc_number,
          company_code: updatedData.company_code,
          company: updatedData.company,
          cnpj: updatedData.cnpj,
          type: updatedData.type as RNCTypeEnum,
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
                product: product.product,
                weight: product.weight
              }))
            );

          if (productsError) throw productsError;
        }
      }

      return rnc.id;
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
      const { data: rnc, error: rncError } = await supabase
        .from("rncs")
        .insert({
          company_code: data.company_code,
          company: data.company,
          cnpj: data.cnpj,
          type: data.type as RNCTypeEnum,
          description: data.description,
          responsible: (await supabase.auth.getUser()).data.user?.email,
          korp: data.korp,
          nfv: data.nfv,
          nfd: data.nfd,
          conclusion: data.conclusion,
          department: data.department,
          workflow_status: data.workflow_status,
          assignedTo: data.assignedTo,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (rncError) throw rncError;

      if (data.products?.length > 0) {
        const { error: productsError } = await supabase
          .from("rnc_products")
          .insert(
            data.products.map(product => ({
              rnc_id: rnc.id,
              product: product.product,
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