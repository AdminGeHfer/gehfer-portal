import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export interface RNCProduct {
  id: string;
  product: string;
  weight: number;
  rnc_id: string;
}

export interface RNCContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  rnc_id: string;
}

export interface RNCAttachment {
  id: string;
  filename: string;
  filesize: number;
  content_type: string;
  file_path: string;
  rnc_id: string;
}

export interface RNCEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  created_by: string;
  created_at: string;
  userName?: string;
}

export interface RNCWorkflowTransition {
  id: string;
  from_status: 'open' | 'analysis' | 'resolution' | 'solved' | 'closing' | 'closed';
  to_status: 'open' | 'analysis' | 'resolution' | 'solved' | 'closing' | 'closed';
  notes: string;
  created_at: string;
  created_by: string;
  user?: string;
}

export interface RNC {
  id: string;
  rnc_number: number;
  company_code: string;
  company: string;
  cnpj: string;
  description: string;
  type: string;
  department: string;
  responsible?: string;
  korp?: string;
  nfv?: string;
  nfd?: string;
  city?: string;
  conclusion?: string;
  status: string;
  workflow_status: string;
  created_at: string;
  products?: RNCProduct[];
  contacts?: RNCContact[];
  attachments?: RNCAttachment[];
  events?: RNCEvent[];
  workflow_transitions?: RNCWorkflowTransition[];
}

export const useRNCData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all RNCs
  const { data: rncs, isLoading: isLoadingRNCs } = useQuery({
    queryKey: ['rncs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rncs')
        .select(`
          *,
          products:rnc_products(id, product, weight),
          contacts:rnc_contacts(id, name, phone, email),
          attachments:rnc_attachments(id, filename, filesize, content_type, file_path),
          events:rnc_events(
            id, 
            title,
            description,
            type,
            created_by,
            created_at,
            created_by_profile:profiles!rnc_events_created_by_fkey(name)
          ),
          workflow_transitions:rnc_workflow_transitions(
            id,
            from_status,
            to_status,
            notes,
            created_at,
            created_by,
            created_by_profile:profiles!rnc_workflow_transitions_created_by_fkey(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching RNCs:', error);
        throw error;
      }

      return data.map(rnc => ({
        ...rnc,
        events: rnc.events?.map(event => ({
          ...event,
          userName: event.created_by_profile?.name
        })),
        workflow_transitions: rnc.workflow_transitions?.map(transition => ({
          ...transition,
          user: transition.created_by_profile?.name
        }))
      }));
    }
  });

  // Fetch single RNC
  const useRNCDetails = (rncId: string) => {
    return useQuery({
      queryKey: ['rnc', rncId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('rncs')
          .select(`
            *,
            products:rnc_products(id, product, weight),
            contacts:rnc_contacts(id, name, phone, email),
            attachments:rnc_attachments(id, filename, filesize, content_type, file_path),
            events:rnc_events(
              id, 
              title,
              description,
              type,
              created_by,
              created_at,
              created_by_profile:profiles!rnc_events_created_by_fkey(name)
            ),
            workflow_transitions:rnc_workflow_transitions(
              id,
              from_status,
              to_status,
              notes,
              created_at,
              created_by,
              created_by_profile:profiles!rnc_workflow_transitions_created_by_fkey(name)
            )
          `)
          .eq('id', rncId)
          .single();

        if (error) {
          console.error('Error fetching RNC details:', error);
          throw error;
        }

        return {
          ...data,
          events: data.events?.map(event => ({
            ...event,
            userName: event.created_by_profile?.name
          })),
          workflow_transitions: data.workflow_transitions?.map(transition => ({
            ...transition,
            user: transition.created_by_profile?.name
          }))
        };
      }
    });
  };

  // Create RNC
  const createRNC = useMutation({
    mutationFn: async (data: Partial<RNC>) => {
      // Start a transaction
      const { data: rnc, error: rncError } = await supabase
        .from('rncs')
        .insert({
          company_code: data.company_code,
          company: data.company,
          cnpj: data.cnpj,
          description: data.description,
          type: data.type,
          department: data.department,
          responsible: data.responsible,
          korp: data.korp,
          nfv: data.nfv,
          nfd: data.nfd,
          city: data.city,
          created_by: user?.id
        })
        .select()
        .single();

      if (rncError) throw rncError;

      // Insert products if any
      if (data.products?.length) {
        const { error: productsError } = await supabase
          .from('rnc_products')
          .insert(
            data.products.map(product => ({
              rnc_id: rnc.id,
              product: product.product,
              weight: product.weight
            }))
          );

        if (productsError) throw productsError;
      }

      // Insert contact if any
      if (data.contacts?.length) {
        const { error: contactError } = await supabase
          .from('rnc_contacts')
          .insert({
            rnc_id: rnc.id,
            name: data.contacts[0].name,
            phone: data.contacts[0].phone,
            email: data.contacts[0].email
          });

        if (contactError) throw contactError;
      }

      return rnc;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rncs'] });
      toast.success('RNC criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating RNC:', error);
      toast.error('Erro ao criar RNC');
    }
  });

  // Update RNC
  const updateRNC = useMutation({
    mutationFn: async ({ id, ...data }: Partial<RNC>) => {
      const { error: rncError } = await supabase
        .from('rncs')
        .update({
          company: data.company,
          cnpj: data.cnpj,
          description: data.description,
          type: data.type,
          department: data.department,
          responsible: data.responsible,
          korp: data.korp,
          nfv: data.nfv,
          nfd: data.nfd,
          city: data.city,
          conclusion: data.conclusion
        })
        .eq('id', id);

      if (rncError) throw rncError;

      // Update products if any
      if (data.products?.length) {
        // Delete existing products
        await supabase
          .from('rnc_products')
          .delete()
          .eq('rnc_id', id);

        // Insert new products
        const { error: productsError } = await supabase
          .from('rnc_products')
          .insert(
            data.products.map(product => ({
              rnc_id: id,
              product: product.product,
              weight: product.weight
            }))
          );

        if (productsError) throw productsError;
      }

      // Update contact if any
      if (data.contacts?.length) {
        const { error: contactError } = await supabase
          .from('rnc_contacts')
          .upsert({
            rnc_id: id,
            name: data.contacts[0].name,
            phone: data.contacts[0].phone,
            email: data.contacts[0].email
          });

        if (contactError) throw contactError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rncs'] });
      toast.success('RNC atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating RNC:', error);
      toast.error('Erro ao atualizar RNC');
    }
  });

  // Delete RNC
  const deleteRNC = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rncs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rncs'] });
      toast.success('RNC excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting RNC:', error);
      toast.error('Erro ao excluir RNC');
    }
  });

  // Update workflow transition notes
  const updateWorkflowTransitionNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from('rnc_workflow_transitions')
        .update({ notes })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rncs'] });
      toast.success('Comentário atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating workflow transition notes:', error);
      toast.error('Erro ao atualizar comentário');
    }
  });

  // Handle file upload
  const uploadFile = async (file: File, rncId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('rnc-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('rnc_attachments')
        .insert({
          rnc_id: rncId,
          filename: file.name,
          filesize: file.size,
          content_type: file.type,
          file_path: filePath,
          created_by: user?.id
        });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['rncs'] });
      toast.success('Arquivo anexado com sucesso!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao anexar arquivo');
    }
  };

  // Delete file
  const deleteFile = async (id: string, filePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('rnc-attachments')
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('rnc_attachments')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['rncs'] });
      toast.success('Arquivo removido com sucesso!');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Erro ao remover arquivo');
    }
  };

  return {
    rncs,
    isLoadingRNCs,
    useRNCDetails,
    createRNC,
    updateRNC,
    deleteRNC,
    updateWorkflowTransitionNotes,
    uploadFile,
    deleteFile
  };
};