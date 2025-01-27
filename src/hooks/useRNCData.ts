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

export type RNCType = 'company_complaint' | 'supplier' | 'dispatch' | 'logistics' | 'deputy' | 'driver' | 'financial' | 'commercial' | 'financial_agreement';
export type RNCDepartment = 'logistics' | 'quality' | 'financial';
export type RNCStatus = 'not_created' | 'pending' | 'canceled' | 'collect' | 'concluded';
export type WorkflowStatus = 'open' | 'analysis' | 'resolution' | 'solved' | 'closing' | 'closed';

export interface RNC {
  id: string;
  rnc_number: number;
  company_code: string;
  company: string;
  cnpj: string;
  description: string;
  type: RNCType;
  department: RNCDepartment;
  responsible?: string;
  korp?: string;
  nfv?: string;
  nfd?: string;
  city?: string;
  conclusion?: string;
  status: RNCStatus;
  workflow_status: WorkflowStatus;
  created_at: string;
  products?: RNCProduct[];
  contacts?: RNCContact[];
  attachments?: RNCAttachment[];
  events?: RNCEvent[];
  workflow_transitions?: RNCWorkflowTransition[];
  days_left?: number;
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

  // Create RNC
  const createRNC = useMutation({
    mutationFn: async (data: Partial<RNC>) => {
      const { data: rnc, error: rncError } = await supabase
        .from('rncs')
        .insert({
          company: data.company,
          cnpj: data.cnpj,
          description: data.description,
          type: data.type as RNCType,
          department: data.department as RNCDepartment,
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

  return {
    rncs,
    isLoadingRNCs,
    createRNC
  };
};